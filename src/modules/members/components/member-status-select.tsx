import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ControllerRenderProps } from 'react-hook-form'
import { MemberSchema } from '../schemas'
import { MemberStatus } from '@/generated/prisma'

type MemberStatusProps = {
  field: ControllerRenderProps<MemberSchema>
}

export default function MemberStatusSelect({ field }: MemberStatusProps) {
  const memberStatus: MemberStatus[] = [
    'INACTIVE',
    'ACTIVE',
    'EXPIRED',
    'SUSPENDED',
  ]

  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select member status" />
      </SelectTrigger>
      <SelectContent>
        {memberStatus.map((m, i) => (
          <SelectItem key={i} value={m}>
            {m}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
