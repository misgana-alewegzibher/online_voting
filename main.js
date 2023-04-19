const formmm = document.getElementById("vote-formm");

// form event listner  start

formmm.addEventListener("submit", (e) => {
  const choice = document.querySelector("input[name=candidates]:checked").value;

  const data = { candidates: choice };

  fetch("http://localhost:3000/vote", {
    method: "post", 
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
   
  e.preventDefault();
});                                             


fetch("http://localhost:3000/vote").then(res => res.json()).then(data=>{
   
console.log(data);

const votes = data.votes;
const totalVotes = votes.length; 

const voteCounts = votes.reduce((acc,vote)=>(acc[vote.candidates]=(acc[vote.candidates] || 0  + parseInt(vote.points)) , acc), {});

let dataPoints = [
  { label: "candidate_1", y: voteCounts.candidate_1 },
  { label: "candidate_2", y: voteCounts.candidate_2 },
  { label: "candidate_3", y: voteCounts.candidate_3 },
];

const chartContainer = document.querySelector("#chartContainer");

if (chartContainer) {
  const chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "theme1",
    title: {
      text: "results",
    },
    data: [
      {
        type: "column",
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