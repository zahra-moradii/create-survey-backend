import { IJWTPayload } from "../utils/Token"
import Controller from "../utils/Controller"
import { User } from "../models/User"
import PasswordManagement from "../utils/passwordManagement"
import { Types } from "mongoose"

interface ReturnAuth {
	firstName: string
	lastName: string
	token: string
}

class AuthController extends Controller {
	async checkUserExist(username: string) {
		const user = await User.findOne({ userName: username })

		return !!user
	}

	async createUser(
		companyName: string,
		firstname: string,
		lastname: string,
		password: string,
		username: string,
		phone: string,
		options: string,
		profile: Types.ObjectId,
	) {
		const newPassword = new PasswordManagement()
		const user = await User.create({
			companyName: companyName,
			userName: username,
			password: password,
			firstName: firstname,
			lastName: lastname,
			phone: phone,
			options: options,
			profile: profile,
		})

		const flatUser = {
			userName: user.userName,
			roles: user.roles,
			permissions: user.permissions,
			profiles: user.profile,
			_id: user.id,
		}
		//const user = await User.create({userName : username, password : password, firstName:firstname, lastName:lastname});
		await user.save()
		await User.updateOne(
			{ userName: username },
			{
				password: await newPassword.hash(password),
				permissions: ["user", "admin", ""],
			},
		)
		await user.save()
		const loginUserData = {
			firstName: "",
			lastName: "",
			companyName: "",
			userName: "",
			options: "",
			phone: "",
			profile: null,
			permission: null,
			id: "",
			token: "",
		}
		if (user.options == "Legal") loginUserData.companyName = user.companyName
		else {
			loginUserData.firstName = user.firstName
			loginUserData.lastName = user.lastName
		}
		loginUserData.userName = user.userName
		loginUserData.options = user.options
		loginUserData.phone = user.phone
		loginUserData.permission = ["user", "admin", ""]
		loginUserData.profile = user.profile
		loginUserData.id = user._id
		loginUserData.token = this.app.utils.sign(flatUser)
		return loginUserData
	}

	async createUserProfile(
		companyName: string,
		firstname: string,
		lastname: string,
		password: string,
		username: string,
		phone: string,
		options: string,
		profile: Types.ObjectId,
	) {
		const newPassword = new PasswordManagement()
		const user = await User.create({
			companyName: companyName,
			userName: username,
			password: password,
			firstName: firstname,
			lastName: lastname,
			phone: phone,
			options: options,
			profile: profile,
		})

		const flatUser = {
			userName: user.userName,
			roles: user.roles,
			permissions: user.permissions,
			profiles: user.profile,
			_id: user.id,
		}
		//const user = await User.create({userName : username, password : password, firstName:firstname, lastName:lastname});
		await user.save()
		await User.updateOne(
			{ userName: username },
			{ password: await newPassword.hash(password) },
		)
		await user.save()
		const loginUserData = {
			firstName: "",
			lastName: "",
			companyName: "",
			userName: "",
			options: "",
			phone: "",
			profile: null,
			id: "",
			token: "",
		}
		if (user.options == "Legal") loginUserData.companyName = user.companyName
		else {
			loginUserData.firstName = user.firstName
			loginUserData.lastName = user.lastName
		}
		loginUserData.userName = user.userName
		loginUserData.options = user.options
		loginUserData.phone = user.phone
		loginUserData.profile = user.profile
		loginUserData.id = user._id
		loginUserData.token = this.app.utils.sign(flatUser)
		return loginUserData
	}

	async loginUser(username: string, password: string) {
		const bycriptPassword = new PasswordManagement()
		const loginUserData = {
			firstName: "",
			lastName: "",
			companyName: "",
			userName: "",
			options: "",
			phone: "",
			permission: [],
			token: "",
		}
		// let name: string;
		const user = await User.findOne({ userName: username })
		if (await user) {
			const flatUser = {
				userName: user.userName,
				roles: user.roles,
				permissions: user.permissions,
				profiles: user.profile,
				_id: user.id,
			}
			// loginUserData.firstName = user.firstName;
			// loginUserData.lastName = user.lastName;
			// loginUserData.companyName = user.companyName;
			const check = await bycriptPassword.compare(password, user.password)
			if (check) {
				if (user.active == "true") {
					if (user.options == "Legal")
						loginUserData.companyName = user.companyName
					else {
						loginUserData.firstName = user.firstName
						loginUserData.lastName = user.lastName
					}
					loginUserData.userName = user.userName
					loginUserData.options = user.options
					loginUserData.phone = user.phone
					loginUserData.permission = user.permissions
					console.log("loginUserData", loginUserData)
					loginUserData.token = this.app.utils.sign(flatUser)
					console.log("loginUserData", loginUserData)

					return loginUserData
				} else return false
			} else return false
		}
		return false
	}
	async deleteAccount(username: string): Promise<boolean> {
		//Please handle this function with route permissions
		const user = await User.findOne({ userName: username })
		if (!user.permissions.includes("admin")) return false
		await User.findOneAndRemove({ username: username })
		return true
	}
	async updatePassword(username: string, password: string): Promise<boolean> {
		// Why using findOneAndUpdate and updateOne
		const newPassword = new PasswordManagement()
		const user = await User.findOneAndUpdate(
			{ userName: username },
			{ password: password },
			{ new: true },
		)

		await User.updateOne(
			{ userName: username },
			{ password: await newPassword.hash(password) },
		)
		await user.save()

		if (await user) {
			return true
		}
		return false
	}
	async updateinfo(
		userName: string,
		firstName: string,
		lastName: string,
		companyName: string,
		phone: string,
	): Promise<boolean> {
		const user = await User.findOneAndUpdate(
			{ userName: userName },
			{
				firstName: firstName,
				lastName: lastName,
				companyName: companyName,
				phone: phone,
			},
			{ new: true },
		)

		if (await user) {
			return true
		}
		return false
	}
	async finduser(username: string) {
		const user = await User.findOne({ userName: username })
		if (await user) {
			const loginUserData = {
				firstName: "",
				lastName: "",
				companyName: "",
				phone: "",
				options: "",
			}
			;(loginUserData.firstName = user.firstName),
				(loginUserData.lastName = user.lastName),
				(loginUserData.companyName = user.companyName),
				(loginUserData.phone = user.phone),
				(loginUserData.options = user.options)

			return loginUserData
		}
		return !!user
	}
}

export default AuthController
