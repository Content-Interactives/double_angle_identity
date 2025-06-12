import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { RefreshCw } from 'lucide-react';

const DoubleAngleIdentity = () => {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showSteps, setShowSteps] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(30);
  const [selectedIdentity, setSelectedIdentity] = useState('sine');
  const [selectedExample, setSelectedExample] = useState('sine');
  const [hasError, setHasError] = useState(false);
  const [cosineVariant, setCosineVariant] = useState('both');
  const [stepAnswers, setStepAnswers] = useState({
    step1: '',
    step2: ''
  });
  const [stepStatus, setStepStatus] = useState({
    step1: false,
    step2: false
  });
  const [step2Error, setStep2Error] = useState(false);
  const [step1Feedback, setStep1Feedback] = useState("");
  const [step1IsChecked, setStep1IsChecked] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showNavigationButtons, setShowNavigationButtons] = useState(false);
  const [navigationDirection, setNavigationDirection] = useState(null);
  const [stepSkipped, setStepSkipped] = useState({
    step1: false,
    step2: false
  });

  const resetStates = () => {
    setUserAnswer('');
    setFeedback('');
    setStepAnswers({ step1: '', step2: '' });
    setStepStatus({ step1: false, step2: false });
    setStep2Error(false);
    setStep1Feedback("");
    setStep1IsChecked(false);
    setCurrentStepIndex(0);
    setShowNavigationButtons(false);
    setNavigationDirection(null);
    setHasError(false);
    setStepSkipped({ step1: false, step2: false });
  };

  const calculateAnswer = (angle, identity) => {
    const rad = angle * Math.PI / 180;
    switch (identity) {
      case 'sine':
        return (2 * Math.sin(rad) * Math.cos(rad)).toFixed(3);
      case 'cosine': {
        if (cosineVariant === 'onlyCos') {
          const cosVal = Math.cos(rad);
          return (2 * cosVal * cosVal - 1).toFixed(3);
        } else if (cosineVariant === 'onlySin') {
          const sinVal = Math.sin(rad);
          return (1 - 2 * sinVal * sinVal).toFixed(3);
        } else {
          return (Math.cos(rad) * Math.cos(rad) - Math.sin(rad) * Math.sin(rad)).toFixed(3);
        }
      }
      case 'tangent':
        return ((2 * Math.tan(rad)) / (1 - Math.tan(rad) * Math.tan(rad))).toFixed(3);
      default:
        return 0;
    }
  };

  const checkAnswer = () => {
    const correctAnswer = calculateAnswer(currentAngle, selectedIdentity);
    const userNumeric = parseFloat(userAnswer).toFixed(3);
    
    setHasError(userNumeric !== correctAnswer);
    if (userNumeric === correctAnswer) {
      setFeedback('Correct!');
    } else {
      setFeedback('');
    }
  };

  const generateNewProblem = () => {
    const angles = [30, 45, 60];
    const identities = ['sine', 'cosine', 'tangent'];
    const newAngle = angles[Math.floor(Math.random() * angles.length)];
    const newIdentity = identities[Math.floor(Math.random() * identities.length)];
    const variants = ['both', 'onlyCos', 'onlySin'];
    
    if (newIdentity === 'cosine') {
      const newVariant = variants[Math.floor(Math.random() * variants.length)];
      setCosineVariant(newVariant);
    }
    
    setCurrentAngle(newAngle);
    setSelectedIdentity(newIdentity);
    setUserAnswer('');
    setFeedback('');
    setShowSteps(false);
    setHasError(false);
    setStepStatus({ step1: false, step2: false });
    setStepAnswers({ step1: '', step2: '' });
  };

  const validateStep2Answer = (input) => {
    const angle = currentAngle / 2;
    const rad = angle * Math.PI / 180;
    
    const cleanInput = input.replace(/\s+/g, '').toLowerCase();
    
    switch (selectedIdentity) {
      case 'sine': {
        const correctAnswer = `2(${Math.sin(rad).toFixed(3)})(${Math.cos(rad).toFixed(3)})`;
        const altAnswer = `2*${Math.sin(rad).toFixed(3)}*${Math.cos(rad).toFixed(3)}`;
        return cleanInput === correctAnswer.replace(/\s+/g, '') || 
               cleanInput === altAnswer.replace(/\s+/g, '');
      }
      case 'cosine': {
        if (cosineVariant === 'onlyCos') {
          const cosVal = Math.cos(rad).toFixed(3);
          const correctAnswer = `2(${cosVal})^2-1`;
          const altAnswer = `2*${cosVal}^2-1`;
          return cleanInput === correctAnswer.replace(/\s+/g, '') || 
                 cleanInput === altAnswer.replace(/\s+/g, '');
        } else if (cosineVariant === 'onlySin') {
          const sinVal = Math.sin(rad).toFixed(3);
          const correctAnswer = `1-2(${sinVal})^2`;
          const altAnswer = `1-2*${sinVal}^2`;
          return cleanInput === correctAnswer.replace(/\s+/g, '') || 
                 cleanInput === altAnswer.replace(/\s+/g, '');
        } else {
          const cosVal = Math.cos(rad).toFixed(3);
          const sinVal = Math.sin(rad).toFixed(3);
          const correctAnswer = `(${cosVal})^2-(${sinVal})^2`;
          const altAnswer = `${cosVal}^2-${sinVal}^2`;
          return cleanInput === correctAnswer.replace(/\s+/g, '') || 
                 cleanInput === altAnswer.replace(/\s+/g, '');
        }
      }
      case 'tangent': {
        const tanVal = calculateAnswer(angle, 'tangent');
        const correctAnswer = `2(${tanVal})/(1-(${tanVal})^2)`;
        const altAnswer = `2*${tanVal}/(1-${tanVal}^2)`;
        return cleanInput === correctAnswer.replace(/\s+/g, '') || 
               cleanInput === altAnswer.replace(/\s+/g, '');
      }
      default:
        return false;
    }
  };

  const checkStepTwo = () => {
    if (!stepAnswers.step2.trim()) {
      setStep2Error(true);
      return;
    }

    const isCorrect = validateStep2Answer(stepAnswers.step2);
    if (isCorrect) {
      setStepStatus(prev => ({ ...prev, step2: true }));
      setStep2Error(false);
    } else {
      setStep2Error(true);
    }
  };

  const skipStepOne = () => {
    setStepAnswers(prev => ({ ...prev, step1: getCorrectIdentity() }));
    setStep1Feedback("Correct!");
    setStep1IsChecked(true);
    setStepStatus(prev => ({ ...prev, step1: true }));
    setStepSkipped(prev => ({ ...prev, step1: true }));
  };

  const getFormattedStep2Answer = () => {
    const angle = currentAngle / 2;
    const rad = angle * Math.PI / 180;
    
    switch (selectedIdentity) {
      case 'sine':
        return `2(${Math.sin(rad).toFixed(3)})(${Math.cos(rad).toFixed(3)})`;
      case 'cosine':
        if (cosineVariant === 'onlyCos') {
          const cosVal = Math.cos(rad).toFixed(3);
          return `2(${cosVal})² - 1`;
        } else if (cosineVariant === 'onlySin') {
          const sinVal = Math.sin(rad).toFixed(3);
          return `1 - 2(${sinVal})²`;
        } else {
          const cosVal = Math.cos(rad).toFixed(3);
          const sinVal = Math.sin(rad).toFixed(3);
          return `(${cosVal})² - (${sinVal})²`;
        }
      case 'tangent': {
        const tanVal = calculateAnswer(angle, 'tangent');
        return `2(${tanVal})/(1 - (${tanVal})²)`;
      }
      default:
        return '';
    }
  };

  const skipStepTwo = () => {
    setStepAnswers(prev => ({ ...prev, step2: getFormattedStep2Answer() }));
    setStepStatus(prev => ({ ...prev, step2: true }));
    setStepSkipped(prev => ({ ...prev, step2: true }));
  };

  const skipFinalStep = () => {
    setUserAnswer(calculateAnswer(currentAngle, selectedIdentity));
    setFeedback('Correct!');
  };

  const getCorrectIdentity = () => {
    switch (selectedIdentity) {
      case 'sine':
        return 'sin(2θ) = 2sin(θ)cos(θ)';
      case 'cosine':
        if (cosineVariant === 'onlyCos') {
          return 'cos(2θ) = 2cos²(θ) - 1';
        } else if (cosineVariant === 'onlySin') {
          return 'cos(2θ) = 1 - 2sin²(θ)';
        } else {
          return 'cos(2θ) = cos²(θ) - sin²(θ)';
        }
      case 'tangent':
        return 'tan(2θ) = 2tan(θ)/(1 - tan²(θ))';
      default:
        return '';
    }
  };

  // Handle navigation
  const handleNavigateHistory = (direction) => {
    setNavigationDirection(direction);
    
    if (direction === 'back' && currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else if (direction === 'forward' && currentStepIndex < 2) {
      setCurrentStepIndex(prev => prev + 1);
    }

    setTimeout(() => {
      setNavigationDirection(null);
    }, 300);
  };

  // Show navigation buttons when all steps are completed
  React.useEffect(() => {
    if (stepStatus.step1 && stepStatus.step2 && feedback) {
      setShowNavigationButtons(true);
    }
  }, [stepStatus, feedback]);

  return (
    <>
      <style>{`
        @property --r {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        .glow-button { 
          min-width: auto; 
          height: auto; 
          position: relative; 
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: all .3s ease;
          padding: 7px;
        }

        .glow-button::before {
          content: "";
          display: block;
          position: absolute;
          background: #fff;
          inset: 2px;
          border-radius: 4px;
          z-index: -2;
        }

        .simple-glow {
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          transition: animation 0.3s ease;
        }

        .simple-glow.stopped {
          animation: none;
          background: none;
        }

        @keyframes rotating {
          0% {
            --r: 0deg;
          }
          100% {
            --r: 360deg;
          }
        }

        .nav-button {
          opacity: 1;
          cursor: default !important;
          position: relative;
          z-index: 2;
          outline: 2px white solid;
        }

        .nav-button-orbit {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          z-index: 0;
        }

        .nav-button-orbit::before {
          content: "";
          position: absolute;
          inset: 2px;
          background: transparent;
          border-radius: 50%;
          z-index: 0;
        }

        .nav-button svg {
          position: relative;
          z-index: 1;
        }
      `}</style>
    <div className="w-[500px] h-auto mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] bg-white rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#5750E3] text-sm font-medium select-none">Double Angle Identity Practice</h2>
          <Button 
            onClick={generateNewProblem}
            className="bg-[#008545] hover:bg-[#00703d] text-white px-4 h-[32px] flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            New Problem
          </Button>
        </div>

        <div className="text-center text-xl mb-4">
          {selectedIdentity === 'cosine' ? (
            <span className="font-mono">
              Find cos(2θ) given {
                cosineVariant === 'both' ? 
                `cos(θ) = ${Math.cos(currentAngle / 2 * Math.PI / 180).toFixed(3)} and sin(θ) = ${Math.sin(currentAngle / 2 * Math.PI / 180).toFixed(3)}` :
                cosineVariant === 'onlyCos' ?
                `cos(θ) = ${Math.cos(currentAngle / 2 * Math.PI / 180).toFixed(3)}` :
                `sin(θ) = ${Math.sin(currentAngle / 2 * Math.PI / 180).toFixed(3)}`
              }
            </span>
          ) : (
            <span className="font-mono">
              {selectedIdentity === 'sine' ? (
                `Find sin(2θ) given sin(θ) = ${Math.sin(currentAngle / 2 * Math.PI / 180).toFixed(3)} and cos(θ) = ${Math.cos(currentAngle / 2 * Math.PI / 180).toFixed(3)}`
              ) : (
                `Find ${selectedIdentity}(2θ) given ${selectedIdentity}(θ) = ${calculateAnswer(currentAngle / 2, selectedIdentity)}`
              )}
            </span>
          )}
        </div>

        <div className={`glow-button ${showSteps ? 'simple-glow stopped' : 'simple-glow'}`}>
          <Button 
              onClick={() => {
                resetStates();
                setShowSteps(true);
              }}
            className="w-full bg-[#008545] hover:bg-[#00703d] text-white py-2 rounded"
          >
            Solve Step by Step
          </Button>
        </div>
      </div>

      {showSteps && (
        <div className="bg-gray-50">
          <div className="p-4 space-y-4">
            <div className="w-full p-2 mb-1 bg-white border border-[#5750E3]/30 rounded-md">
              {currentStepIndex === 0 && (
                <>
                  <p className="text-sm mb-2">Step 1: Select the correct double angle identity:</p>
                  <div>
                    <div className="space-y-2 mb-4">
                      {!stepStatus.step1 ? (
                        <>
                          <button
                            onClick={() => {
                              if (!step1IsChecked || stepAnswers.step1 !== getCorrectIdentity()) {
                                setStepAnswers(prev => ({ ...prev, step1: 'sin(2θ) = 2sin(θ)cos(θ)' }));
                                setStep1Feedback("");
                                setStep1IsChecked(false);
                              }
                            }}
                            disabled={step1IsChecked && stepAnswers.step1 === getCorrectIdentity()}
                            className={`block w-full text-left p-3 rounded text-sm ${
                              stepAnswers.step1 === 'sin(2θ) = 2sin(θ)cos(θ)' 
                                ? !step1IsChecked
                                  ? 'bg-[#5750E3]/10 border border-[#5750E3]'
                                  : stepAnswers.step1 === getCorrectIdentity()
                                    ? 'bg-[#008545]/10 border border-[#008545]'
                                    : 'bg-yellow-100 border border-yellow-500'
                                : step1IsChecked && stepAnswers.step1 === getCorrectIdentity()
                                  ? 'bg-[#008545]/10 border border-[#008545]'
                                  : 'bg-white hover:bg-gray-50 border border-gray-200'
                            } ${step1IsChecked && stepAnswers.step1 === getCorrectIdentity() ? 'cursor-default' : ''}`}
                          >
                            sin(2θ) = 2sin(θ)cos(θ)
                          </button>
                          <button
                            onClick={() => {
                              if (!step1IsChecked || stepAnswers.step1 !== getCorrectIdentity()) {
                                setStepAnswers(prev => ({ ...prev, step1: 'cos(2θ) = cos²(θ) - sin²(θ)' }));
                                setStep1Feedback("");
                                setStep1IsChecked(false);
                              }
                            }}
                            disabled={step1IsChecked && stepAnswers.step1 === getCorrectIdentity()}
                            className={`block w-full text-left p-3 rounded text-sm ${
                              stepAnswers.step1 === 'cos(2θ) = cos²(θ) - sin²(θ)' 
                                ? !step1IsChecked
                                  ? 'bg-[#5750E3]/10 border border-[#5750E3]'
                                  : stepAnswers.step1 === getCorrectIdentity()
                                    ? 'bg-[#008545]/10 border border-[#008545]'
                                    : 'bg-yellow-100 border border-yellow-500'
                                : step1IsChecked && 'cos(2θ) = cos²(θ) - sin²(θ)' === getCorrectIdentity() && stepAnswers.step1 === getCorrectIdentity()
                                  ? 'bg-[#008545]/10 border border-[#008545]'
                                  : 'bg-white hover:bg-gray-50 border border-gray-200'
                            } ${step1IsChecked && stepAnswers.step1 === getCorrectIdentity() ? 'cursor-default' : ''}`}
                          >
                            cos(2θ) = cos²(θ) - sin²(θ)
                          </button>
                          <button
                            onClick={() => {
                              if (!step1IsChecked || stepAnswers.step1 !== getCorrectIdentity()) {
                                setStepAnswers(prev => ({ ...prev, step1: 'cos(2θ) = 2cos²(θ) - 1' }));
                                setStep1Feedback("");
                                setStep1IsChecked(false);
                              }
                            }}
                            disabled={step1IsChecked && stepAnswers.step1 === getCorrectIdentity()}
                            className={`block w-full text-left p-3 rounded text-sm ${
                              stepAnswers.step1 === 'cos(2θ) = 2cos²(θ) - 1' 
                                ? !step1IsChecked
                                  ? 'bg-[#5750E3]/10 border border-[#5750E3]'
                                  : stepAnswers.step1 === getCorrectIdentity()
                                    ? 'bg-[#008545]/10 border border-[#008545]'
                                    : 'bg-yellow-100 border border-yellow-500'
                                : step1IsChecked && 'cos(2θ) = 2cos²(θ) - 1' === getCorrectIdentity() && stepAnswers.step1 === getCorrectIdentity()
                                  ? 'bg-[#008545]/10 border border-[#008545]'
                                  : 'bg-white hover:bg-gray-50 border border-gray-200'
                            } ${step1IsChecked && stepAnswers.step1 === getCorrectIdentity() ? 'cursor-default' : ''}`}
                          >
                            cos(2θ) = 2cos²(θ) - 1
                          </button>
                          <button
                            onClick={() => {
                              if (!step1IsChecked || stepAnswers.step1 !== getCorrectIdentity()) {
                                setStepAnswers(prev => ({ ...prev, step1: 'cos(2θ) = 1 - 2sin²(θ)' }));
                                setStep1Feedback("");
                                setStep1IsChecked(false);
                              }
                            }}
                            disabled={step1IsChecked && stepAnswers.step1 === getCorrectIdentity()}
                            className={`block w-full text-left p-3 rounded text-sm ${
                              stepAnswers.step1 === 'cos(2θ) = 1 - 2sin²(θ)' 
                                ? !step1IsChecked
                                  ? 'bg-[#5750E3]/10 border border-[#5750E3]'
                                  : stepAnswers.step1 === getCorrectIdentity()
                                    ? 'bg-[#008545]/10 border border-[#008545]'
                                    : 'bg-yellow-100 border border-yellow-500'
                                : step1IsChecked && 'cos(2θ) = 1 - 2sin²(θ)' === getCorrectIdentity() && stepAnswers.step1 === getCorrectIdentity()
                                  ? 'bg-[#008545]/10 border border-[#008545]'
                                  : 'bg-white hover:bg-gray-50 border border-gray-200'
                            } ${step1IsChecked && stepAnswers.step1 === getCorrectIdentity() ? 'cursor-default' : ''}`}
                          >
                            cos(2θ) = 1 - 2sin²(θ)
                          </button>
                          <button
                            onClick={() => {
                              if (!step1IsChecked || stepAnswers.step1 !== getCorrectIdentity()) {
                                setStepAnswers(prev => ({ ...prev, step1: 'tan(2θ) = 2tan(θ)/(1 - tan²(θ))' }));
                                setStep1Feedback("");
                                setStep1IsChecked(false);
                              }
                            }}
                            disabled={step1IsChecked && stepAnswers.step1 === getCorrectIdentity()}
                            className={`block w-full text-left p-3 rounded text-sm ${
                              stepAnswers.step1 === 'tan(2θ) = 2tan(θ)/(1 - tan²(θ))' 
                                ? !step1IsChecked
                                  ? 'bg-[#5750E3]/10 border border-[#5750E3]'
                                  : stepAnswers.step1 === getCorrectIdentity()
                                    ? 'bg-[#008545]/10 border border-[#008545]'
                                    : 'bg-yellow-100 border border-yellow-500'
                                : step1IsChecked && 'tan(2θ) = 2tan(θ)/(1 - tan²(θ))' === getCorrectIdentity() && stepAnswers.step1 === getCorrectIdentity()
                                  ? 'bg-[#008545]/10 border border-[#008545]'
                                  : 'bg-white hover:bg-gray-50 border border-gray-200'
                            } ${step1IsChecked && stepAnswers.step1 === getCorrectIdentity() ? 'cursor-default' : ''}`}
                          >
                            tan(2θ) = 2tan(θ)/(1 - tan²(θ))
                          </button>
                        </>
                      ) : (
                        <p className="text-[#008545] font-medium">{stepAnswers.step1}</p>
                      )}
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      {(!step1IsChecked || stepAnswers.step1 !== getCorrectIdentity()) && (
                        <div className="glow-button simple-glow">
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                if (stepAnswers.step1) {
                                  if (stepAnswers.step1 === getCorrectIdentity()) {
                                    setStep1Feedback("Correct!");
                                    setStepStatus(prev => ({ ...prev, step1: true }));
                                    setStepSkipped(prev => ({ ...prev, step1: false }));
                                  } else {
                                    setStep1Feedback("Incorrect. Try again!");
                                  }
                                  setStep1IsChecked(true);
                                }
                              }}
                              className="bg-[#00783E] hover:bg-[#006633] text-white text-sm px-4 py-2 rounded"
                            >
                              Check
                            </Button>
                            <Button
                              onClick={skipStepOne}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-md"
                            >
                              Skip
                            </Button>
                          </div>
                        </div>
                      )}
                      {stepStatus.step1 && !showNavigationButtons && (
                        <div className="flex items-center gap-2">
                          {!stepSkipped.step1 && (
                            <span className="text-green-600 font-medium">Great Job!</span>
                          )}
                          <div className="glow-button simple-glow">
                            <Button
                              onClick={() => setCurrentStepIndex(1)}
                              className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md"
                            >
                              Continue
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {currentStepIndex === 1 && stepStatus.step1 && (
                <>
                  <p className="text-sm mb-2">Step 2: Substitute the values in the identity:</p>
                  <div className="space-y-2">
                    {!stepStatus.step2 ? (
                      <>
                        <div className={`flex items-center border rounded-md overflow-hidden relative ${
                          step2Error ? 'border-red-500' : ''
                        }`}>
                          <span className="bg-gray-100 px-3 py-2 text-gray-700 border-r rounded-l-md">
                            {selectedIdentity}(2θ) =
                          </span>
                          <div className="flex-1 relative">
                            <Input
                              type="text"
                              value={stepAnswers.step2}
                              onChange={(e) => {
                                setStepAnswers(prev => ({ ...prev, step2: e.target.value }));
                                setStep2Error(false);
                              }}
                              placeholder="Enter the expression"
                              className={`w-full border-0 rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0 ${
                                step2Error ? 'bg-red-50' : ''
                              }`}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <div className="glow-button simple-glow">
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => {
                                  checkStepTwo();
                                  if (validateStep2Answer(stepAnswers.step2)) {
                                    setStepSkipped(prev => ({ ...prev, step2: false }));
                                  }
                                }} 
                                className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md"
                              >
                                Check
                              </Button>
                              <Button 
                                onClick={skipStepTwo} 
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-md"
                              >
                                Skip
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center mb-4">
                          <span className="text-gray-700">
                            {selectedIdentity}(2θ) =
                          </span>
                          <span className="ml-2 font-medium text-[#008545]">
                            {stepAnswers.step2}
                          </span>
                        </div>
                        {!showNavigationButtons && (
                          <div className="flex justify-end items-center gap-2">
                            {!stepSkipped.step2 && (
                              <span className="text-green-600 font-medium">Great Job!</span>
                            )}
                            <div className="glow-button simple-glow">
                              <Button
                                onClick={() => setCurrentStepIndex(2)}
                                className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md"
                              >
                                Continue
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}

              {currentStepIndex === 2 && stepStatus.step2 && (
                <>
                  <p className="text-sm mb-2">Step 3: Simplify:</p>
                  {!feedback ? (
                    <div className="flex items-center gap-4">
                      <Input 
                        type="number"
                        step="0.001"
                        value={userAnswer}
                        onChange={(e) => {
                          setUserAnswer(e.target.value);
                          setHasError(false);
                        }}
                        placeholder="Enter your answer"
                        className={`flex-1 ${hasError ? 'border-red-500' : 'border-blue-300'}`}
                      />
                      <div className="glow-button simple-glow">
                        <div className="flex gap-2">
                          <Button
                            onClick={checkAnswer}
                            className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md"
                          >
                            Check
                          </Button>
                          <Button
                            onClick={skipFinalStep}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-md"
                          >
                            Skip
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <span className="font-medium text-[#008545]">
                          {calculateAnswer(currentAngle, selectedIdentity)}
                        </span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 mt-4">
              <div
                className="nav-orbit-wrapper"
                style={{
                  position: 'relative',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  visibility: showNavigationButtons && currentStepIndex > 0 ? 'visible' : 'hidden',
                  opacity: showNavigationButtons && currentStepIndex > 0 ? 1 : 0,
                  pointerEvents: showNavigationButtons && currentStepIndex > 0 ? 'auto' : 'none',
                  transition: 'opacity 0.2s ease',
                }}
              >
                <div className="nav-button-orbit"></div>
                <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', background: 'white', zIndex: 1 }}></div>
                <button
                  onClick={() => handleNavigateHistory('back')}
                  className={`nav-button w-8 h-8 flex items-center justify-center rounded-full bg-[#008545]/20 text-[#008545] hover:bg-[#008545]/30 relative z-50`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
              </div>
              <span className="text-sm text-gray-500 min-w-[100px] text-center">
                Step {currentStepIndex + 1} of 3
              </span>
              <div
                className="nav-orbit-wrapper"
                style={{
                  position: 'relative',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  visibility: showNavigationButtons && currentStepIndex < 2 ? 'visible' : 'hidden',
                  opacity: showNavigationButtons && currentStepIndex < 2 ? 1 : 0,
                  pointerEvents: showNavigationButtons && currentStepIndex < 2 ? 'auto' : 'none',
                  transition: 'opacity 0.2s ease',
                }}
              >
                <div className="nav-button-orbit"></div>
                <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', background: 'white', zIndex: 1 }}></div>
                <button
                  onClick={() => handleNavigateHistory('forward')}
                  className={`nav-button w-8 h-8 flex items-center justify-center rounded-full bg-[#008545]/20 text-[#008545] hover:bg-[#008545]/30 relative z-50`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default DoubleAngleIdentity;