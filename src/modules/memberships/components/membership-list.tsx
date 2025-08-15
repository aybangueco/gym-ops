import MembershipCard from './membership-card'
import { MembershipsResponse } from '../types'

type MembershipListProps = {
  memberships: MembershipsResponse
}

export default function MembershipList({ memberships }: MembershipListProps) {
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
  if (memberships.data.length === 0) {
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
