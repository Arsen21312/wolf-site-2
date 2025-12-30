import type { Participant } from './parseParticipants'
import type { Team } from './splitTeams'
import { shuffleParticipants } from './shuffle'

type BalanceOptions = {
  shuffleBeforeSort?: boolean
}

export const balanceTeams = (participants: Participant[], teamsCount: number, options: BalanceOptions = {}): Team[] => {
  if (teamsCount <= 0) return []

  const teams: Team[] = Array.from({ length: teamsCount }, () => ({ members: [], totalWeight: 0 }))
  const list = options.shuffleBeforeSort ? shuffleParticipants(participants) : participants.slice()

  list.sort((a, b) => b.weight - a.weight)

  list.forEach((participant) => {
    let targetIndex = 0
    let minWeight = teams[0]?.totalWeight ?? 0
    for (let i = 1; i < teams.length; i += 1) {
      if (teams[i].totalWeight < minWeight) {
        minWeight = teams[i].totalWeight
        targetIndex = i
      }
    }
    teams[targetIndex].members.push(participant)
    teams[targetIndex].totalWeight += participant.weight
  })

  return teams
}
