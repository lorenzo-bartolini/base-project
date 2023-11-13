export interface Claim {
  id?: number
  // version?: number
  marshNumberClaim?: string
  orderNumberEA?: string
  orderVersion?: number
  startDate?: Date
  endDate?: string
  policyNumber?: string
  delegatingCompany?: string
  mainWarranty?: string
  claimCompanyNumber?: string
  complainant?: any
  description?: string
  type?: any
  typeDescription?: string
  causeDescription?: string
  claimStatus?: string
  claimStatusDescription?: string
  location?: string
  province?: string
  damageValue?: number
  deductible?: number
  due?: number
  paid?: number
  paidFromEA?: number
  paymentDateFromEA?: Date
  status?: any

}
