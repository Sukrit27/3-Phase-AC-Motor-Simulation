import React, { useState, useEffect } from "react";
import "./App.css";


function App() {
  const [rpm, setRpm] = useState(0);
  const [temperature, setTemperature] = useState(null);
  const [images, setImages] = useState([]);
  
  const rpmSteps = [0, 1000, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2800, 3000];

  const rpmData = {
    0: { temperature: 0, images: ["url1.jpg"] },
    1000: { temperature: 505.5907, images: ["image/1000heat.jpg", "image/1000temp.jpg"] },
    2000: { temperature: 637.6853, images: ["image/2000heat.jpg", "image/2000temp.jpg"] },
    2100: { temperature: 649.0876, images: ["image/2100heat.jpg", "image/2100temp.jpg"] },
    2200: { temperature: 664.5388, images: ["image/2200heat.jpg", "image/2200temp.jpg"] },
    2300: { temperature: 685.4056, images: ["image/2300heat.jpg", "image/2300temp.jpg"] },
    2400: { temperature: 703.2339, images: ["image/2400heat.jpg", "image/2400temp.jpg"] },
    2500: { temperature: 714.6644, images: ["image/2500heat.jpg", "image/2500temp.jpg"] },
    2600: { temperature: 731.3327, images: ["image/2600heat.jpg", "image/2600temp.jpg"] },
    // 2700: { temperature: 65, images: ["url10.jpg"] },
    2800: { temperature: 772.2987, images: ["image/2800heat.jpg", "image/2800temp.jpg"] },
    3000: { temperature: 75, images: ["image/3000heat.jpg", "image/3000temp.jpg"] },
  };

  useEffect(() => {
    const fetchInitialRpm = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-rpm");
        const data = await response.json();
        setRpm(data.rpm);
        const initialData = rpmData[data.rpm];
        setTemperature(initialData.temperature);
        setImages(initialData.images);
      } catch (error) {
        console.error("Error fetching initial RPM:", error);
      }
    };
    fetchInitialRpm();
  }, []);

  const handleRpmChange = async (e) => {
    const index = parseInt(e.target.value, 10);
    const newRpm = rpmSteps[index];
    setRpm(newRpm);
    const data = rpmData[newRpm];
    setTemperature(data.temperature);
    setImages(data.images);

    try {
      await fetch("http://localhost:5000/update-rpm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rpm: newRpm }),
      });
    } catch (error) {
      console.error("Error updating RPM on the backend:", error);
    }
  };

  const calculateRotorSpeed = (rpm) => {
        if (rpm === 0) return "paused";
    
        let duration;
        if (rpm === 2800) {
          duration = 0.03;
        } else {
          const normalizedRpm = 3000 - rpm;
          duration = (normalizedRpm / 3000) * 0.8 + 0.02;
        }
        return `${duration}s`;
      };

  const rotorSpeed = calculateRotorSpeed(rpm);

  return (
    <div className="Body">
      <div className="App">
        <h1>AC Motor Simulation</h1>
        <div className="motor-container">
          <div className="motor-body">
            <div className="stator-coils">
              <div className="stator-coil" style={{ transform: "rotate(0deg) translateX(80px)" }}></div>
              <div className="stator-coil" style={{ transform: "rotate(120deg) translateX(80px)" }}></div>
              <div className="stator-coil" style={{ transform: "rotate(240deg) translateX(80px)" }}></div>
            </div>
            <div
              className="rotor"
              style={{
                animationDuration: rotorSpeed,
                animationPlayState: rpm === 0 ? "paused" : "running",
              }}
            >
              <div className="rotor-blade"></div>
              <div className="rotor-blade"></div>
              <div className="rotor-blade"></div>
              <div className="rotor-blade"></div>
            </div>
          </div>
        </div>
        <div className="motor-data">RPM: {rpm}</div>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max={rpmSteps.length - 1}
            step="1"
            value={rpmSteps.indexOf(rpm)}
            onChange={handleRpmChange}
          />
          <div className="slider-labels">
            {rpmSteps.map((step, index) => (
              <span
                key={index}
                style={{ width: `${100 / (rpmSteps.length - 1)}%`, textAlign: "center" }}
              >
                {step}
              </span>
            ))}
          </div>
        </div>
        {temperature !== null && (
          <div>
            <h2>Temperature: {temperature}°C</h2>
            <div className="image-gallery">
              {images.map((image, index) => (
                <img key={index} src={image} alt={`Motor Image ${index + 1}`} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;








// frontend + backend


// import React, { useState, useEffect } from "react";
// import "./App.css";

// function App() {
//   // State to track RPM
//   const [rpm, setRpm] = useState(0);

//   // State to track temperature and image URLs
//   const [temperature, setTemperature] = useState(null);
//   const [images, setImages] = useState([]);

//   // Define RPM steps for the slider
//   const rpmSteps = [0, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 3000];

//   // Fetch initial RPM value from the backend when the component mounts
//   useEffect(() => {
//     const fetchInitialRpm = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/get-rpm");
//         const data = await response.json();
//         setRpm(data.rpm);
//       } catch (error) {
//         console.error("Error fetching initial RPM:", error);
//       }
//     };
//     fetchInitialRpm();
//   }, []);

//   // Handle slider change by mapping index to corresponding RPM value
//   const handleRpmChange = async (e) => {
//     const index = parseInt(e.target.value, 10);
//     const newRpm = rpmSteps[index];
//     setRpm(newRpm);

//     // Send updated RPM to the backend
//     try {
//       await fetch("http://localhost:5000/update-rpm", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ rpm: newRpm }),
//       });
//     } catch (error) {
//       console.error("Error updating RPM on the backend:", error);
//     }
//   };

//   // Fetch temperature and images when the button is clicked
//   const handleGetTemperatureAndImages = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/get-temperature-and-images");
//       const data = await response.json();
//       setTemperature(data.temperature); // Assume backend returns { temperature: value, images: [...] }
//       setImages(data.images);
//     } catch (error) {
//       console.error("Error fetching temperature and images:", error);
//     }
//   };

//   // Adjust animation duration using an inverted scaling formula for smoother transitions
//   const calculateRotorSpeed = (rpm) => {
//     if (rpm === 0) return "paused";

//     let duration;
//     if (rpm === 2800) {
//       duration = 0.03;
//     } else {
//       const normalizedRpm = 3000 - rpm;
//       duration = (normalizedRpm / 3000) * 0.8 + 0.02;
//     }
//     return `${duration}s`;
//   };

//   const rotorSpeed = calculateRotorSpeed(rpm);

//   return (
//    <div className="Body"> 
//     <div className="App">
//       <h1>AC Motor Simulation</h1>
//       <div className="motor-container">
//         <div className="motor-body">
//           <div className="stator-coils">
//             <div className="stator-coil" style={{ transform: "rotate(0deg) translateX(80px)" }}></div>
//             <div className="stator-coil" style={{ transform: "rotate(120deg) translateX(80px)" }}></div>
//             <div className="stator-coil" style={{ transform: "rotate(240deg) translateX(80px)" }}></div>
//           </div>
//           <div
//             className="rotor"
//             style={{
//               animationDuration: rotorSpeed,
//               animationPlayState: rpm === 0 ? "paused" : "running",
//             }}
//           >
//             <div className="rotor-blade"></div>
//             <div className="rotor-blade"></div>
//             <div className="rotor-blade"></div>
//             <div className="rotor-blade"></div>
//           </div>
//         </div>
//       </div>
//       <div className="motor-data">RPM: {rpm}</div>
//       <div className="slider-container">
//         <input
//           type="range"
//           min="0"
//           max={rpmSteps.length - 1}
//           step="1"
//           value={rpmSteps.indexOf(rpm)}
//           onChange={handleRpmChange}
//         />
//         <div className="slider-labels">
//           {rpmSteps.map((step, index) => (
//             <span
//               key={index}
//               style={{
//                 width: `${100 / (rpmSteps.length - 1)}%`,
//                 textAlign: "center",
//               }}
//             >
//               {step}
//             </span>
//           ))}
//         </div>
//       </div>
//       <button onClick={handleGetTemperatureAndImages}>
//         Get Temperature & Images
//       </button>
//       {temperature !== null && (
//         <div>
//           <h2>Temperature: {temperature}°C</h2>
//           <div className="image-gallery">
//             {images.map((image, index) => (
//               <img key={index} src={image} alt={`Motor Image ${index + 1}`} />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
//   );
// }

// export default App;




// frontend




// import React, { useState } from "react";
// import "./App.css";

// function App() {
//   // State to track RPM
//   const [rpm, setRpm] = useState(0);

//   // Define RPM steps for the slider
//   const rpmSteps = [0, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 3000];

//   // Handle slider change by mapping index to corresponding RPM value
//   const handleRpmChange = (e) => {
//     const index = parseInt(e.target.value, 10); // Slider value is an index
//     setRpm(rpmSteps[index]);
//   };

//   // Adjust animation duration using an inverted scaling formula for smoother transitions
//   const calculateRotorSpeed = (rpm) => {
//     if (rpm === 0) return "paused"; // Stop animation if RPM is 0

//     // Custom scaling logic for each RPM value
//     let duration;
//     if (rpm === 2800) {
//       duration = 0.03; // Specifically set duration for 2800 RPM
//     } else {
//       const normalizedRpm = 3000 - rpm; // Invert RPM to prioritize higher speeds
//       duration = (normalizedRpm / 3000) * 0.8 + 0.02; // Scale and add base duration
//     }
//     return `${duration}s`; // Return animation duration
//   };

//   // Calculate the rotor animation duration
//   const rotorSpeed = calculateRotorSpeed(rpm);

//   return (
//     <div className="App">
//       <h1>AC Motor Simulation</h1>
//       <div className="motor-container">
//         <div className="motor-body">
//           {/* Stator coils */}
//           <div className="stator-coils">
//             <div className="stator-coil" style={{ transform: "rotate(0deg) translateX(80px)" }}></div>
//             <div className="stator-coil" style={{ transform: "rotate(120deg) translateX(80px)" }}></div>
//             <div className="stator-coil" style={{ transform: "rotate(240deg) translateX(80px)" }}></div>
//           </div>
//           {/* Rotor */}
//           <div
//             className="rotor"
//             style={{
//               animationDuration: rotorSpeed, // Set animation duration dynamically
//               animationPlayState: rpm === 0 ? "paused" : "running", // Pause if RPM is 0
//             }}
//           >
//             <div className="rotor-blade"></div>
//             <div className="rotor-blade"></div>
//             <div className="rotor-blade"></div>
//             <div className="rotor-blade"></div>
//           </div>
//         </div>
//       </div>
//       <div className="motor-data">RPM: {rpm}</div>
//       <div className="slider-container">
//         <input
//           type="range"
//           min="0"
//           max={rpmSteps.length - 1} // Max value corresponds to the last index of rpmSteps
//           step="1"
//           value={rpmSteps.indexOf(rpm)} // Find the index of the current RPM in rpmSteps
//           onChange={handleRpmChange}
//         />
//         <div className="slider-labels">
//           {rpmSteps.map((step, index) => (
//             <span
//               key={index}
//               style={{
//                 width: `${100 / (rpmSteps.length - 1)}%`, // Space labels evenly
//                 textAlign: "center",
//               }}
//             >
//               {step}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
