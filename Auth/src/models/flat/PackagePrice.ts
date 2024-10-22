import { ObjectId, Types } from "mongoose"

export type PackagePrice = {
	packageId: Types.ObjectId
	duration: string //based on months
	price: number
	users: number
	forms: number
}
