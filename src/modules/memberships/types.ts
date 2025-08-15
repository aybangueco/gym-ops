import { Membership } from '@/generated/prisma'
import { ActionState } from '../types'

export interface MembershipsResponse extends ActionState {
  data: Membership[]
}

export interface MembershipResponse extends ActionState {
  data: Membership | null
}
