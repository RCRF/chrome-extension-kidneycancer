import React, { useEffect } from 'react';
import logo from '../../assets/img/bgKidney.png';
import './Popup.css';
import { useState } from 'react';

const Popup = () => {

  const [score, setScore] = useState(0);
  const [prediction, setPrediction] = useState([]);
  const [patientDetails, setPatientDetails] = useState({
    sex: null,
    age: null,
    sizeOfTumor: null,
    familyHistory: null,
    familyHistoryType: null,
    race: null,
    bilateral: null,
    metastatic: null,
    liverOnly: null,
    side: null
  });

  const pointLookup = {
    youngWoman: 2,
    sickleCellTrait: 2,
    youngBlackMale: 2,
    youngRightKidney: 1,
    leiomyomas: 2,
    fibriods: 1,
    youngMetastatic: 2,
    youngOver7cm: 1,
    under18: 2,
    under45WithFamilyHistory: 2,
    bilateralMultifolcal: 3,
    familyBdh: 2,
    familyTsc: 2,
    familyVhl: 1,
    tumorSmallLocal: -1,
    over54: -2,
    liverOnly: 3,
    local4cm7cm: 0,
    local7cm10cm: 1,
    local10cm: 1,
    rightSide: 1,
    larger7cm: 1
  }

  const familyHistoryTypes = [
    { label: "FH Mutation HLRCC", value: "HLRCC" },
    { label: "BHD Birt Hogg Dube", value: "BHD" },
    { label: "TSC-Associated RCC", value: "TSC" },
    { label: "VHL-Associated RCC", value: "VHL" },
  ]


  const under41 = patientDetails.age > 0 && patientDetails.age < 41
  const under10 = patientDetails.age > 0 && patientDetails.age < 8 && patientDetails.age > 0

  const checkChromophobe = () => {

    if (patientDetails.sickleCellTrait > 0) {
      //if sickel cell trait is present remove Chromophobe
      setPrediction(prevPredictions => {
        if (prevPredictions.includes("RMC")) {
          return prevPredictions.filter(prediction => prediction !== "Chromophobe");

        } else {
          return prevPredictions;
        }
      })
      setPrediction(prevPredictions => {
        if (!prevPredictions.includes("RMC")) {
          return [...prevPredictions, "RMC"];
        } else {
          return prevPredictions;
        }
      });;
    } else {

      if ((under41 && patientDetails.age >= 21 && patientDetails.sex === 'female' && patientDetails.familyHistory !== true && (patientDetails.metastatic === false || patientDetails.metastatic === null))
        || (patientDetails.sizeOfTumor > 0 && patientDetails.sizeOfTumor > 10 && patientDetails.age > 21)) {
        setPrediction(prevPredictions => {
          if (!prevPredictions.includes("Chromophobe")) {
            return [...prevPredictions, "Chromophobe"];
          } else {
            return prevPredictions;
          }
        });
      }
      else if (patientDetails.liverOnly > 0 && patientDetails.liverOnly) {
        setPrediction(prevPredictions => {
          if (!prevPredictions.includes("Chromophobe")) {
            return [...prevPredictions, "Chromophobe"];
          } else {
            return prevPredictions;
          }
        });
      }
    }

  }

  const checkWilms = () => {
    if (under10) {
      setPrediction(prevPredictions => {
        if (!prevPredictions.includes("Wilms Tumor")) {
          return [...prevPredictions, "Wilms Tumor"];
        } else {
          return prevPredictions;
        }
      });
    }
  }

  const checkFamilyType = (type) => {
    const familyTypeItem = familyHistoryTypes.filter(item => item.value === type);
    if (patientDetails.familyHistory === true && patientDetails.familyHistoryType === type) {
      setPrediction(prevPredictions => {
        if (!prevPredictions.includes(familyTypeItem[0].label)) {
          return [...prevPredictions, familyTypeItem[0].label];
        } else {
          return prevPredictions;
        }
      });
    }
  }


  const checkPapillary = () => {
    if (patientDetails.bilateral !== null && patientDetails.bilateral === true) {
      setPrediction(prevPredictions => {
        if (!prevPredictions.includes("Papillary")) {
          return [...prevPredictions, "Papillary"];
        } else {
          return prevPredictions;
        }
      });
    }
  }




  const checkRCM = () => {
    if (under41
      && (patientDetails.race !== null && patientDetails.race === "Black_AfricanAmerican") && patientDetails.age > 0) {
      setPrediction(prevPredictions => {
        if (!prevPredictions.includes("RMC")) {
          return [...prevPredictions, "RMC"];
        } else {
          return prevPredictions;
        }
      });
    }

    if ((patientDetails.race !== null && patientDetails.race === "Black_AfricanAmerican")
      && (patientDetails.rightSide !== null && patientDetails.rightSide === true)) {
      setPrediction(prevPredictions => {
        if (!prevPredictions.includes("RMC")) {
          return [...prevPredictions, "RMC"];
        } else {
          return prevPredictions;
        }
      });
    }

    if (patientDetails.age < 16 && patientDetails.race === "Black_AfricanAmerican") {
      setPrediction(prevPredictions => {
        if (!prevPredictions.includes("RMC")) {
          return [...prevPredictions, "RMC"];
        } else {
          return prevPredictions;
        }
      });
    }

  }







  useEffect(() => {
    function calculateScore() {
      let totalPoints = 0;

      // Check age and sex criteria
      if (patientDetails.age > 0 && patientDetails.age < 41 && patientDetails.sex === 'female') {
        totalPoints += pointLookup.youngWoman;
      }

      //40 and under metastatic
      if (patientDetails.age > 0 && patientDetails.age < 41 && patientDetails.metastatic === true) {
        totalPoints += pointLookup.youngMetastatic;
      }

      //40 and under large tumor >7cm
      if (patientDetails.age > 0 && patientDetails.age < 41 && patientDetails.sizeOfTumor > 7) {
        totalPoints += pointLookup.youngOver7cm;
      }

      //Under 18 years old
      if (patientDetails.age > 0 && patientDetails.age < 18) {
        totalPoints += pointLookup.under18;
      }

      //Under 45 w/family history of kidney cancer
      if (patientDetails.age > 0 && patientDetails.age < 45 && patientDetails.familyHistory === true) {
        totalPoints += pointLookup.under45WithFamilyHistory;
      }

      //Over 54 years old
      if (patientDetails.age > 0 && patientDetails.age > 54) {
        totalPoints += pointLookup.over54;
      }

      //Under 18 years old
      if (patientDetails.age > 0 && patientDetails.age < 18) {
        totalPoints += pointLookup.under18;
      }

      //Check race for RMC
      if (patientDetails.age > 0 && patientDetails.age < 41
        && patientDetails.race !== null && patientDetails.race === 'Black_AfricanAmerican'
        && patientDetails.sex === "male"
      ) {
        totalPoints += pointLookup.youngBlackMale;

        //Add check for laterality (right side more common in RMC)
        if (patientDetails.rightSide) {
          totalPoints += pointLookup.rightSide;
        }
      }

      if (patientDetails.metastatic !== null
        && patientDetails.metastatic === true) {
        //Check for liver only mets in large tumors (more likely in ChRCC)
        if (patientDetails.liverOnly !== null
          && patientDetails.liverOnly == true
          && patientDetails.sizeOfTumor > 9) {
          totalPoints += pointLookup.liverOnly
          setPrediction(prevPredictions => {
            if (!prevPredictions.includes("Chromophobe")) {
              return [...prevPredictions, "Chromophobe"];
            } else {
              return prevPredictions;
            }
          });
        }
      }

      //Check for large tumor that hasn't spread under 50
      if (patientDetails.age > 0
        && patientDetails.age < 55
        && patientDetails.sizeOfTumor !== null
        && patientDetails.sizeOfTumor > 10
      ) {
        totalPoints += pointLookup.local10cm;
        if (patientDetails.age > 14) {
          setPrediction(prevPredictions => {
            if (!prevPredictions.includes("Chromophobe")) {
              return [...prevPredictions, "Chromophobe"];
            } else {
              return prevPredictions;
            }
          });
        }
      }

      //Check for large tumor 
      if (
        patientDetails.sizeOfTumor > 0
        && patientDetails.sizeOfTumor > 7
      ) {
        totalPoints += pointLookup.larger7cm;

      }

      //Check for sickle cell trait
      if (
        patientDetails.sickleCellTrait !== null
        && patientDetails.sickleCellTrait === true
      ) {
        totalPoints += pointLookup.sickleCellTrait;
        setPrediction(prevPredictions => {
          if (!prevPredictions.includes("RMC")) {
            return [...prevPredictions, "RMC"];
          } else {
            return prevPredictions;
          }
        });

      }


      //Check for bilateral or multifocal
      if (
        patientDetails.bilateral !== null && patientDetails.bilateral === true
      ) {
        totalPoints += pointLookup.bilateralMultifolcal

      }
      return totalPoints;
    }

    const score = calculateScore();
    setScore(score);

  }, [patientDetails]);

  const guessType = () => {
    if (patientDetails.age < 1 && patientDetails.sizeOfTumor < 4) {
      setScore(0)
    }
    setPrediction([])
    if (score >= 2) {
      checkChromophobe();
      checkRCM();
      checkWilms();
      checkPapillary();
      checkFamilyType("BHD");
      checkFamilyType("HLRCC");
      checkFamilyType("TSC");
      checkFamilyType("VHL");

      if (prediction.length < 1) {
        setPrediction("Non-clear cell")
      }
    } else {
      if (patientDetails.age > 0 && patientDetails.sex !== null) {
        setPrediction(prevPredictions => {
          if (!prevPredictions.includes("Not likely Non-Clear Cell")) {
            return [...prevPredictions, "Not likely Non-Clear Cell"];
          } else {
            return prevPredictions;
          }
        });
      }

    }
  }

  const reset = () => {
    setPatientDetails(
      {
        sex: null,
        age: null,
        sizeOfTumor: null,
        familyHistory: null,
        familyHistoryType: null,
        race: null,
        bilateral: null,
        metastatic: null,
        liverOnly: null,
        side: null
      })
    setScore(0);
    setPrediction([]);

  }



  return (
    <div className="App p-4">
      <div>
        <img src={logo} className="App-logo" alt="logo" />
      </div>
      <header className="App-header">
        <h3 className='App-header-text'>
          Non-Clear Cell Estimator
        </h3>

        <div className='App-form'>
          {/* Select Sex */}
          <div className='text-left mt-3'>
            Sex
            <div className="grid grid-cols-2 gap-5">
              <button className={patientDetails.sex === 'male' ? 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded pt-2' : 'bg-white hover:bg-blue-600 text-slate-700 font-bold py-2 px-4 rounded pt-2'} onClick={() => setPatientDetails(prevDetails => ({ ...prevDetails, sex: "male" }))}>Male</button>
              <button className={patientDetails.sex === 'female' ? 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded pt-2' : 'bg-white hover:bg-blue-600 text-slate-700 font-bold py-2 px-4 rounded pt-2'} onClick={() => setPatientDetails(prevDetails => ({ ...prevDetails, sex: "female" }))}>Female</button>
            </div>
          </div>

          <div className='text-left w-full mt-3'>
            Race/Ethnicity
          </div>
          <select
            className='border rounded w-full py-2 px-3'
            value={patientDetails.race || ''}
            onChange={(e) => setPatientDetails(prevDetails => ({ ...prevDetails, race: e.target.value }))}
          >
            <option value="">Select Race</option>
            <option value="AmericanIndian">American Indian or Alaska Native</option>
            <option value="Asian">Asian</option>
            <option value="Black_AfricanAmerican">Black or African American</option>
            <option value="Hispanic">Hispanic or Latino</option>
            <option value="NativeHawaiian">Native Hawaiian or Pacific Islander</option>
            <option value="White">White</option>
            <option value="Other">Other</option>
          </select>

          <div className='grid grid-cols-3 gap-4 mt-5 pb-5 text-left pr-7'>

            {/* Race */}
            <div className='col-span-2'>
              {/* Tumor size Input */}
              <div>
                <div>Tumor Size (cm)</div>
                <input
                  value={patientDetails.sizeOfTumor || ''}
                  className='shadow appearance-none border rounded w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  type="number"
                  onChange={(e) => setPatientDetails(prevDetails => ({ ...prevDetails, sizeOfTumor: e.target.value }))}

                />
              </div>

            </div>
            <div className='col-span-1'>
              {/* Age Input */}
              <div className='text-left'>Age</div>
              <input
                value={patientDetails.age || ''}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                type="number"
                onChange={(e1) => setPatientDetails(prevDetails => ({ ...prevDetails, age: e1.target.value }))}

              />
            </div>
          </div>



          <div className="grid grid-cols-2 text-left">
            {/* Laterality */}
            <div className="">
              Which kidney
              <div className='two-items'>
                <button className={patientDetails.side === 'right' ? 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-1' : 'bg-white hover:bg-blue-600 text-slate-700 font-bold py-2 px-4 rounded mt-1'} onClick={() => setPatientDetails(prevDetails => ({ ...prevDetails, side: 'right' }))}>Right</button>
                <button className={patientDetails.side === 'left' ? 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-1' : 'bg-white hover:bg-blue-600 text-slate-700 font-bold py-2 px-4 rounded mt-1'} onClick={() => setPatientDetails(prevDetails => ({ ...prevDetails, side: 'left' }))}>Left</button>
              </div>
            </div>

            {/* Family History */}
            <div className=''>
              Family History
              <div className='two-items'>
                <button className={patientDetails.familyHistory == true ? 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-1' : 'bg-white hover:bg-blue-600 text-slate-700 font-bold py-2 px-4 rounded mt-1'} onClick={() => setPatientDetails(prevDetails => ({ ...prevDetails, familyHistory: true }))}>Yes</button>
                <button className={patientDetails.familyHistory == false ? 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-1' : 'bg-white hover:bg-blue-600 text-slate-700 font-bold py-2 px-4 rounded mt-1'} onClick={() => setPatientDetails(prevDetails => ({ ...prevDetails, familyHistory: false }))}>No</button>
              </div>
            </div>
          </div>

          {/* Family History Type*/}

          {
            patientDetails.familyHistory == true ? (
              <div className='text-left mt-3'>
                Family history of
                <div className='two-items grid grid-cols-2'>
                  {familyHistoryTypes.map(type => {
                    return <button className={patientDetails.familyHistoryType === type.value ? 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-1' : 'bg-white hover:bg-blue-600 text-slate-700 font-bold py-2 px-4 rounded mt-1'} onClick={() => setPatientDetails(prevDetails => ({ ...prevDetails, familyHistoryType: type.value }))}>{type.label}</button>
                  })}
                </div>
              </div>) : null
          }

          {/* Stage */}
          <div className='mt-3 text-left grid grid-cols-2'>
            <div>
              Metastatic
              <div className='two-items'>
                <button className={patientDetails.metastatic == true ? 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-1' : 'bg-white hover:bg-blue-600 text-slate-700 font-bold py-2 px-4 rounded mt-1'} onClick={() => setPatientDetails(prevDetails => ({ ...prevDetails, metastatic: true }))}>Yes</button>
                <button className={patientDetails.metastatic === false ? 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-1' : 'bg-white hover:bg-blue-600 text-slate-700 font-bold py-2 px-4 rounded mt-1'} onClick={() => setPatientDetails(prevDetails => ({ ...prevDetails, metastatic: false }))}>No</button>
              </div>
            </div>
            {patientDetails.metastatic === true ? (
              <div>
                Liver only mets
                <div className='two-items'>
                  <button className={patientDetails.liverOnly == true ? 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-1' : 'bg-white hover:bg-blue-600 text-slate-700 font-bold py-2 px-4 rounded mt-1'} onClick={() => setPatientDetails(prevDetails => ({ ...prevDetails, liverOnly: true }))}>Yes</button>
                  <button className={patientDetails.liverOnly === false ? 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-1' : 'bg-white hover:bg-blue-600 text-slate-700 font-bold py-2 px-4 rounded mt-1'} onClick={() => setPatientDetails(prevDetails => ({ ...prevDetails, liverOnly: false }))}>No</button>
                </div>
              </div>) : null}
          </div>




          {/* Bilateral */}
          <div className='mt-3 text-left'>
            Tumors in both kidneys/multiple in one
            <p className='subHeading'>(Bilateral/multifocal)</p>
            <div className='two-items'>
              <button className={patientDetails.bilateral == true ? 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-1' : 'bg-white hover:bg-blue-600 text-slate-700 font-bold py-2 px-4 rounded mt-1'} onClick={() => setPatientDetails(prevDetails => ({ ...prevDetails, bilateral: true }))}>Yes</button>
              <button className={patientDetails.bilateral === false ? 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-1' : 'bg-white hover:bg-blue-600 text-slate-700 font-bold py-2 px-4 rounded mt-1'} onClick={() => setPatientDetails(prevDetails => ({ ...prevDetails, bilateral: false }))}>No</button>
            </div>
          </div>

          {/* Sickle cell trait */}
          <div className='mt-3 text-left'>
            Sickle cell trait
            <div className='two-items'>
              <button className={patientDetails.sickleCellTrait === true ? 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-1' : 'bg-white hover:bg-blue-600 text-slate-700 font-bold py-2 px-4 rounded mt-1'} onClick={() => setPatientDetails(prevDetails => ({ ...prevDetails, sickleCellTrait: true }))}>Yes</button>
              <button className={patientDetails.sickleCellTrait === false ? 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-1' : 'bg-white hover:bg-blue-600 text-slate-700 font-bold py-2 px-4 rounded mt-1'} onClick={() => setPatientDetails(prevDetails => ({ ...prevDetails, sickleCellTrait: false }))}>No</button>
            </div>
          </div>

          <button className={'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-10 w-full'} onClick={guessType}>Check</button>
          <div className='mt-2'>Prediction: {Array.isArray(prediction) && prediction.length > 1
            ? prediction.map((type, index) =>
              (index !== prediction.length - 1) ? type + " or " : type)
            : prediction}</div>
          <div className='mb-5 text-sm'>{prediction[0] === "BHD Birt Hogg Dube" ? "(chromophobe, oncocytoma, papillary)" : ''}</div>
          <button className="mb-10 text-white underline bg-transparent border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-right" onClick={reset}>
            Reset
          </button>

        </div >




      </header >
    </div >
  );
};

export default Popup;
