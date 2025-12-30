import type { Participant } from './parseParticipants'

export type Team = {
  members: Participant[]
  totalWeight: number
}

export const splitTeams = (participants: Participant[], teamsCount: number): Team[] => {
  if (teamsCount <= 0) return []
  const teams: Team[] = Array.from({ length: teamsCount }, () => ({ members: [], totalWeight: 0 }))

  participants.forEach((participant, index) => {
    const team = teams[index % teamsCount]
    team.members.push(participant)
    team.totalWeight += participant.weight
  })

  return teams
}
