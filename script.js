document.addEventListener('DOMContentLoaded', () => {
    let groupA = [
        { team: 'Team 1', w: 0, l: 0, points: 0 },
        { team: 'Team 2', w: 0, l: 0, points: 0 },
        { team: 'Team 3', w: 0, l: 0, points: 0 },
        { team: 'Team 4', w: 0, l: 0, points: 0 },
    ];

    let groupB = [
        { team: 'Team 5', w: 0, l: 0, points: 0 },
        { team: 'Team 6', w: 0, l: 0, points: 0 },
        { team: 'Team 7', w: 0, l: 0, points: 0 },
        { team: 'Team 8', w: 0, l: 0, points: 0 },
    ];

    let matchesA = [
        { teams: ["Team 1", "Team 4"], score: "0-0" },
        { teams: ["Team 2", "Team 3"], score: "0-0" },
        { teams: ["TB", "TB"], score: "0-0" },
        { teams: ["TB", "TB"], score: "0-0" },
        { teams: ["TB", "TB"], score: "0-0" }
    ];

    let matchesB = [
        { teams: ["Team 5", "Team 8"], score: "0-0" },
        { teams: ["Team 6", "Team 7"], score: "0-0" },
        { teams: ["TB", "TB"], score: "0-0" },
        { teams: ["TB", "TB"], score: "0-0" },
        { teams: ["TB", "TB"], score: "0-0" }
    ];

    const groupATitles = ["Opening Matches", "Opening Matches", "Winners Match", "Elimination Match", "Decider Match"];
    const groupBTitles = ["Opening Matches", "Opening Matches", "Winners Match", "Elimination Match", "Decider Match"];

    function updateTeamResults(group, matches) {
        group.forEach(team => {
            team.w = 0;
            team.l = 0;
            team.points = 0;
        });

        matches.forEach(match => {
            const [score1, score2] = match.score.split('-').map(Number);
            const team1 = group.find(t => t.team === match.teams[0]);
            const team2 = group.find(t => t.team === match.teams[1]);

            if (team1 && team2) {
                if (score1 > score2) {
                    team1.w++;
                    team2.l++;
                } else if (score2 > score1) {
                    team2.w++;
                    team1.l++;
                }
                team1.points += score1;
                team2.points += score2;
            }
        });

        group.sort((a, b) => {
            if (a.w !== b.w) return b.w - a.w;
            if (a.points !== b.points) return b.points - a.points;
            return a.l - b.l;
        });
    }

    function updateTable(group, groupId) {
        const tableBody = document.getElementById(groupId);
        tableBody.innerHTML = '';

        group.forEach((team, index) => {
            const row = document.createElement('tr');
            if (index < 2) row.classList.add('qualified');
            if (index >= 2) row.classList.add('eliminated');

            row.innerHTML = `
                <td>${team.team}</td>
                <td>${team.w}-${team.l}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function renderMatches(matches, bracketId, sectionTitles) {
        const bracket = document.getElementById(bracketId);
        bracket.innerHTML = ''; // Clear previous render

        matches.forEach((match, index) => {
            const section = document.createElement('div');
            section.className = 'match-section';

            // Check if the previous title is the same as the current title to avoid repeating
            const previousTitle = index > 0 ? sectionTitles[index - 1] : null;
            if (sectionTitles[index] !== previousTitle) {
                const title = document.createElement('h3');
                title.textContent = sectionTitles[index];
                section.appendChild(title);
            }

            const matchDiv = document.createElement('div');
            matchDiv.className = 'match';

            match.teams.forEach((team, teamIndex) => {
                const teamDiv = document.createElement('div');
                teamDiv.className = 'team';
                const teamName = document.createElement('span');
                teamName.className = 'team-name';
                teamName.textContent = team;

                const teamScore = document.createElement('span');
                teamScore.className = 'team-score';
                teamScore.textContent = match.score.split('-')[teamIndex];

                teamDiv.appendChild(teamName);
                teamDiv.appendChild(teamScore);
                matchDiv.appendChild(teamDiv);
            });

            section.appendChild(matchDiv);
            bracket.appendChild(section);
        });
    }


    function updateScore(group, matches, team1, team2, newScore) {
        const match = matches.find(m => m.teams.includes(team1) && m.teams.includes(team2));
        if (match) {
            match.score = newScore;
            updateTeamResults(group, matches);
            updateTable(group, group === groupA ? 'group-a-body' : 'group-b-body');
            renderMatches(matches, group === groupA ? 'group-a-bracket' : 'group-b-bracket', group === groupA ? groupATitles : groupBTitles);
        }
    }

    function updateMatchesAfterOpening(group, matches) {
        const openingMatchWinners = [];
        const openingMatchLosers = [];

        // Identifiez les gagnants et les perdants des "Opening Matches"
        for (let i = 0; i < 2; i++) { // Les deux premiers matchs sont les "Opening Matches"
            const [score1, score2] = matches[i].score.split('-').map(Number);
            const team1 = group.find(t => t.team === matches[i].teams[0]);
            const team2 = group.find(t => t.team === matches[i].teams[1]);

            if (score1 > score2) {
                openingMatchWinners.push(team1.team);
                openingMatchLosers.push(team2.team);
            } else {
                openingMatchWinners.push(team2.team);
                openingMatchLosers.push(team1.team);
            }
        }

        // Mettez à jour les "Winners Match" et "Elimination Match"
        matches[2].teams = openingMatchWinners; // "Winners Match"
        matches[3].teams = openingMatchLosers;  // "Elimination Match"
    }


    // Initial render
    updateTeamResults(groupA, matchesA);
    updateTeamResults(groupB, matchesB);
    updateTable(groupA, 'group-a-body');
    updateTable(groupB, 'group-b-body');
    renderMatches(matchesA, 'group-a-bracket', groupATitles);
    renderMatches(matchesB, 'group-b-bracket', groupBTitles);
    updateMatchesAfterOpening(groupA, matchesA);
    updateMatchesAfterOpening(groupB, matchesB);

    // Example usage to update a score dynamically
    //updateScore(groupA, matchesA, 'Team 1', 'Team 4', '2-1');
    //updateScore(groupA, matchesA, 'Team 2', 'Team 3', '1-2');
});
