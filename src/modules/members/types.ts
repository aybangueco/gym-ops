import { Member } from '@/generated/prisma'
import { ActionState } from '../types'

export interface MembersResponse extends ActionState {
  data: Member[]
}

export interface MemberResponse extends ActionState {
  data: Member | null
}
