const video = document.getElementById("videoweb");
const form = document.getElementById("loginform");
const logbtnn = document.getElementById("logbtn");
const full_name = document.getElementById("full_name");

logbtnn.addEventListener('click', recognizeFaces);

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('./public/dist/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./public/dist/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('./public/dist/models')
]).then(startWebcam);

function startWebcam() {
  document.body.append("models loaded");
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  );  
  recognizeFaces();
}

async function recognizeFaces() {
  console.log("playing1");
  const full_name= document.querySelector("input[name=full_name]").value;
  console.log(full_name);
  console.log( full_name);
  console.log( full_name);
  console.log( full_name);
  const labeledDescriptors = await loadLabeledImages(full_name);
  console.log("playing2");
  const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7);
  console.log("playing3");

  video.addEventListener('play', async () => {
    console.log( full_name);
    console.log( full_name);
    console.log( full_name);
    console.log( full_name);
    console.log( full_name);
    console.log("playing");
    console.log("playing");
    console.log("playing");
    console.log("playing");
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = {
      width: video.width,
      height: video.height
    };
    faceapi.matchDimensions(canvas, displaySize);

    while (true) {
      const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

      const results = resizedDetections.map((d) => {
        return faceMatcher.findBestMatch(d.descriptor)
      });

      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
        drawBox.draw(canvas)
        const bestMatch = results[0];
        const accuracy = bestMatch._distance;
        
        // Check if the accuracy is above 0.7 and redirect if it is
        // if (label === full_name && accuracy > 0.7) {
        //   window.location.href = "./views/bootstrap/voting.html";
        // }
         if (result.label === full_name && accuracy > 0.5) {
           window.location.href = "./views/bootstrap/profile.html";
         }
      })

      await new Promise(resolve => setTimeout(resolve, 100));
    }
  });
}

// form.addEventListener("submit", async (e) => {
//   e.preventDefault();
  
//   const full_name = document.querySelector("input[name=full_name]").value;
//   console.log(full_name);
//   console.log(full_name); console.log(full_name); console.log(full_name);
//   try {
//     const labeledDescriptors = await loadLabeledImages(full_name);
//     const data = { full_name, labeledDescriptors };
     
//     // Send the data to the server
//     const response = await fetch("/login", {
//       method: "POST",
//       body: JSON.stringify(data),
//       headers: new Headers({
//         "Content-Type": "application/json",
//       }),
//     });
    
//     // Handle the server response
//     const result = await response.json();
//     console.log(result);
    
//   } catch (err) {
//     console.log(err);
//   }
// });
 

// async function loadLabeledImages(full_name) {
//   console.log(full_name);
//   full_name="lexi";
//   const labels = [full_name];
//   const acceptedExtensions = ['.jpg', '.png', '.jiff', '.jpeg'];
//   return Promise.all(labels.map(async (label) => {
//     const descriptions = [];
//     for (let i = 1; i <= 3; i++) {
//       for (let ext of acceptedExtensions) {
//         const imgPath = `./uploads/${full_name}/${label}/${i}${ext}`;
//         try {
//           const img = await faceapi.fetchImage(imgPath);
//           const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
//           descriptions.push(detections.descriptor);
//           break;
//         } catch (e) {
//           console.log(`Image not found: ${imgPath}`);
//         }
//       }
//     }
//     document.body.append(label + " faces loaded");
//     return new faceapi.LabeledFaceDescriptors(label, descriptions);
//   }));
// }

  // Do something with the labeledFaceDescriptors
  async function loadLabeledImages(full_name) {

    
    const labeledDescriptors = [];
    const labels = [full_name];
    const acceptedExtensions = ['.jpg', '.png', '.jiff', '.jpeg'];
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 3; i++) {
          for (let ext of acceptedExtensions) {
            const imgPath = `./uploads/${label}/${i}${ext}`;
            try {
              const img = await faceapi.fetchImage(imgPath);
              const detections = await faceapi
                .detectSingleFace(img)
                .withFaceLandmarks()
                .withFaceDescriptor();
              descriptions.push(detections.descriptor);
              break;
            } catch (e) {
              console.log(`Image not found: ${imgPath}`);
            }
          }
        }
        document.body.append(label + ' faces loaded');
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  }
  

  logbtnn.addEventListener('click', async () => {
    const full_name= document.querySelector("input[name=full_name]").value;
    console.log(full_name);
    console.log('sssssssssssssssss');
    console.log('sssssssssssssssss');
    console.log('sssssssssssssssss');
    console.log('sssssssssssssssss');
    const labeledDescriptors = await loadLabeledImages(full_name);
    console.log(labeledDescriptors);
  });
  

// function loadLabeledImages() {
//   const labels = ['messi']
//   return Promise.all(labels.map(async (label) => {
//     const descriptions = []
//     for (let i = 1; i <= 5; i++) {
//       const img = await faceapi.fetchImage(`./public/dist/Labels/${label}/${i}.jpg`);
//       const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
//       descriptions.push(detections.descriptor)
//     }
//     document.body.append(label + "faces loaded");
//     return new faceapi.LabeledFaceDescriptors(label, descriptions);
//   }));
// }
