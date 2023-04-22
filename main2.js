
fetch("http://localhost:3000/vote").then(res => res.json()).then(data=>{

const tt = data ;
const votes = data.votes;
const totalVotes = votes.length; 
    
    console.log(votes); 
    const voteCounts = {};
    votes.forEach(vote => {
      const candidate = vote.candidates;
      const points = parseInt(vote.points);
      voteCounts[candidate] = (voteCounts[candidate] || 0) + points;
    });
    
// const voteCounts = votes.reduce((acc,vote)=>(acc[vote.candidates]=(acc[vote.candidates] || 0  + parseInt(vote.points)) , acc), {});

console.log(voteCounts);

let dataPoints = [
  { label: "candidate_1", y: voteCounts.candidate_1 },
  { label: "candidate_2", y: voteCounts.candidate_2 },
  { label: "candidate_3", y: voteCounts.candidate_3 },
];

const chartContainer = document.querySelector("#chartContainer");

if (chartContainer) {
  const chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    animationDuration: 2000,
    animationEasing: "easeOutQuart",
    theme: "theme3",
    title: {
      text: `Total votes = ${totalVotes}`,
    },
    
    data: [
      {
        type: "pie",
        dataPoints: dataPoints,
      },
    ],
  });
  chart.render();

  Pusher.logToConsole = true;

  var pusher = new Pusher("ef719bb549cacd708e04", {
    cluster: "mt1",
    debug: true,
  });

  var channel = pusher.subscribe("os-poll");
  channel.bind("os-vote", function (data) {
    dataPoints = dataPoints.map((x) => {
      if (x.label == data.candidates) {
        x.y += data.points;
        return x;
      } else {
        return x;
      }
    });
    chart.render();
  });
}

// form event listner end

});

// form event listner en


// form event listner en



