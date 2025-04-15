export const enum PAYMENT_METHOD {
  VN_PAY = 'VN_PAY',
  CASH = 'CASH'
}

export const enum LOCAL_STORAGE_KEY {
  ORDERED_TEMP_PRODUCT = 'ordered_temp_product',
  ORDERED_INFO_USER = 'ordered_info_user',
  USER = 'user',
  PENDING_ORDER = 'pending_order'
}

export const enum ORDER_STATUS {
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

export const enum CONSULTING_CUSTOMER_STATUS {
  CREATE = 'CREATE',
  SEARCH = 'SEARCH'
}

export enum Category {
  SKINCARE = 'SKIN_CARE',
  MAKEUP = 'MAKE_UP',
  HAIRCARE = 'HAIR_CARE',
  BODYCARE = 'BODY_CARE',
  PERSONAL_CARE = 'PERSONAL_CARE',
  TOOLSANDBRUSHES = 'TOOLS_AND_BRUSHES'
}

export enum Rank {
  MEMBER = 'MEMBER',
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  DIAMOND = 'DIAMOND',
  PLATINUM = 'PLATINUM'
}

export enum Role {
  MANAGER = 'MANAGER',
  SALESTAFF = 'SALESTAFF',
  CONSULTANT = 'CONSULTANT',
  CUSTOMER = 'CUSTOMER'
}

export enum EmployeeType {
  PARTTIME = 'PARTTIME',
  FULLTIME = 'FULLTIME'
}

export enum Brand {}

export enum Unit {
  BOX = 'BOX',
  TUBE = 'TUBE',
  PACK = 'PACK',
  PCS = 'PCS'
}

export const urlImage = () =>
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF60zFhSl23dWXNtksiXqrWtW4F3_ig5IKUIBb59YJNqyvz-6dBkE9X7BqdIJiw26UTgA&usqp=CAU'
