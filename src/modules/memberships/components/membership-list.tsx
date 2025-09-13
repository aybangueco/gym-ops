import { Membership } from '@/generated/prisma'
import MembershipCard from './membership-card'
import { ActionState } from '@/modules/types'

export default function MembershipList({
  memberships,
}: {
  memberships: ActionState<Membership[] | null>
}) {
  const gridClasses = 'mt-10 grid gap-5 sm:grid-cols-1 lg:grid-cols-2'.trim()

  // Error state
  if (!memberships.ok || memberships.error) {
    return (
      <div className={gridClasses} role="alert">
        <div className="text-destructive col-span-full text-center">
          <p>
            Error loading memberships:{' '}
            {memberships.error?.message || 'Unknown error'}
          </p>
        </div>
      </div>
    )
  }

  // Empty state
  if (!memberships.data) {
    return (
      <div className={gridClasses}>
        <div className="col-span-full text-center">
          <p>No memberships available.</p>
        </div>
      </div>
    )
  }

  // Available state
  return (
    <div className={gridClasses} aria-label="Membership listings">
      {memberships.data.map((membership) => (
        <MembershipCard
          key={membership.id}
          data={membership}
          aria-labelledby={`membership-${membership.id}`}
        />
      ))}
    </div>
  )
}
