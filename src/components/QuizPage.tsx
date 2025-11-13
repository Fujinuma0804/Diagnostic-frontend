import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface QuizQuestion {
  id: number;
  serial_number: number;
  question: string;
  options: { text: string; parameters: Record<string, number> }[];
}

export default function QuizPage() {
  const navigate = useNavigate();
  const isDebug = import.meta.env.VITE_DEBUG === 'true';
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [fadeIn, setFadeIn] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conditions, setConditions] = useState<any[]>([]);
  const [matchedResult, setMatchedResult] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(isDebug ? '/json/quiz.json' : `${import.meta.env.VITE_BACKEND_URL}/api/quiz`);
        if (!response.ok) throw new Error('Failed to fetch quiz');
        const data: QuizQuestion[] = await response.json();
        setQuizData(data);
        setAnswers(new Array(data.length).fill(null));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();

    const fetchConditions = async () => {
      try {
        const response = await fetch(isDebug ? '/json/conditions.json' : `${import.meta.env.VITE_BACKEND_URL}/api/conditions`);
        if (!response.ok) throw new Error('Failed to fetch conditions');
        const data = await response.json();
        setConditions(data);
      } catch (e) {
        // ignore fetch conditions errors
      }
    };
    fetchConditions();

    const preloadImages = async () => {
      try {
        const response = await fetch(isDebug ? '/json/blogs.json' : `${import.meta.env.VITE_BACKEND_URL}/api/blogs`);
        if (!response.ok) return;
        const data = await response.json();
        data.forEach((char: any) => {
          [char.result_img1, char.result_img2, char.result_img3].forEach((src: string) => {
            const img = new Image();
            img.src = src;
          });
        });
      } catch (e) {
        // ignore preload errors
      }
    };
    preloadImages();
  }, [isDebug]);

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
    setErrorMessage(null); // Clear error when answering
  };

  const handleNext = () => {
    if (answers[currentIndex] === null) {
      setErrorMessage("質問に答えてから次へ進んでください。");
      return;
    }
    setErrorMessage(null);
    if (currentIndex < quizData.length - 1) {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setFadeIn(true);
      }, 300);
     } else {
       const matched = getResultCharacter();
       if (matched.length > 0) {
         const title = matched[0].redirect;
         navigate(`/quiz/result/${title.replace(/\//g, '-')}`);
       } else {
         navigate(`/quiz/result/マンジャロ`);
       }
     }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setFadeIn(true);
      }, 300);
    }
  };

  const calculateParameterSums = () => {
    const sums: Record<string, number> = {};
    answers.forEach((ans, idx) => {
      if (ans !== null) {
        const params = quizData[idx].options[ans].parameters;
        Object.keys(params).forEach(key => {
          sums[key] = (sums[key] || 0) + params[key];
        });
      }
    });
    return sums;
  };

  const evaluateCondition = (conditionText: string, sums: Record<string, number>) => {
    const subconditions = conditionText.split(' and ');
    for (const sub of subconditions) {
      const trimmed = sub.trim();
      let op: string, param: string, valueStr: string;
      if (trimmed.includes(' > ')) {
        [param, valueStr] = trimmed.split(' > ');
        op = '>';
      } else if (trimmed.includes(' < ')) {
        [param, valueStr] = trimmed.split(' < ');
        op = '<';
      } else {
        console.error('Unsupported operator in subcondition:', trimmed);
        return false;
      }
      const value = parseFloat(valueStr);
      const paramValue = sums[param] || 0;
      if (op === '>' && !(paramValue > value)) return false;
      if (op === '<' && !(paramValue < value)) return false;
    }
    return true;
  };

  const getResultCharacter = () => {
    const sums = calculateParameterSums();
    const matched: any[] = [];
    for (const cond of conditions) {
      if (!cond.text || typeof cond.text !== 'string') continue;
      const matches = evaluateCondition(cond.text, sums);
      if (matches) matched.push(cond);
    }
    return matched;
  };



  return (
    <div className="min-h-screen pb-8" style={{ backgroundColor: '#FFF5F5' }}>
      <div className="main-body" style={{ width: 'fit-content', margin: '0 auto', padding: '10px', backgroundColor: 'white', backgroundImage: 'linear-gradient(#F3F3F3 1px, transparent 1px), linear-gradient(90deg, #F3F3F3 1px, transparent 1px)', backgroundSize: '20px 20px', borderRadius: '23px' }}>
        {/* Header Section */}
        <div className="px-6 pt-8 pb-0">
          <div className="max-w-md mx-auto">
            <h1 className="text-pink-400 text-center mb-0 header-1" style={{ fontFamily: 'cursive', textDecoration: 'underline', textDecorationColor: '#FF0000' }}>
              <ImageWithFallback
                src="https://i.ibb.co/B2FdYNTB/Group-213.png"
                alt="Character"
                className="w-full h-full object-cover-1"
              />
            </h1>
          </div>
        </div>
        {/* Quiz Section */}
        <div className="max-w-md mx-auto px-6 mt-8">
           <div className="border-2 character-body" style={{ borderColor: 'rgb(255, 245, 245)', backgroundColor: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0px 0px 13.8px #FFD4E0', overflow: 'hidden' }}>
            {loading ? (
              <p className="text-center">Loading quiz...</p>
            ) : error ? (
              <p className="text-center text-red-500">Error: {error}</p>
            ) : currentIndex < quizData.length ? (
              <div style={{ transition: 'opacity 0.3s ease', opacity: fadeIn ? 1 : 0 }}>
                <div style={{ textAlign: 'center', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'baseline' }}>
                  <span style={{ color: '#E5557F', fontSize: '40px', fontWeight: 'bold', fontFamily: 'Montserrat' }}>{currentIndex + 1}</span>                  <span style={{ color: 'black', fontSize: '25px', fontWeight: 'bold', fontFamily: 'Montserrat' }}>&nbsp;<span style={{ fontStyle: 'italic', fontFamily: 'Montserrat' }}>/</span>&nbsp;{quizData.length}</span>
                </div>
                <div style={{ width: 'auto', height: '8px', backgroundColor: '#F5F5F5', borderRadius: '10px', marginTop: '15px', marginBottom: '20px' }}>
                  <div style={{ width: `${((currentIndex + 1) / quizData.length) * 100}%`, height: '100%', backgroundColor: '#E5557F', borderRadius: '10px' }}></div>
                </div>
                 <h2 className="mb-4 text-lg font-semibold" style={{ backgroundColor: '#FFF5F5', width: 'auto', height: 'auto', padding: '20px', textAlign: 'left', borderRadius: '10px', marginTop: '38px', position: 'relative' }}>
                   <div style={{ position: 'absolute', top: '-25px', left: '-25px', width: '50px', height: '50px' }}>
                     <img src="https://i.ibb.co/XxMHdb1h/Union.png" alt="Q" style={{ width: '100%', height: '100%', position: 'relative' }} />
                     <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#E5557F', fontSize: '16px', fontWeight: 'bold', fontFamily: 'Montserrat' }}>
                       Q{currentIndex + 1}
                     </span>
                   </div>
                   {quizData[currentIndex].question}
                 </h2>
                <div className="my-[4px]">
                  {quizData[currentIndex].options.map((option, idx) => (
                    <label key={idx} style={{
                      borderRadius: '10px',
                      borderColor: '#E0E0E0',
                      marginBottom: idx < quizData[currentIndex].options.length - 1 ? '4px' : '0',
                      backgroundColor: answers[currentIndex] === idx ? '#00C37F' : 'white',
                      color: answers[currentIndex] === idx ? 'white' : 'black',
                      boxShadow: answers[currentIndex] === idx ? '0px 1px 1px rgba(0,0,0,0.3)' : 'none',
                      transition: 'all 0.2s ease'
                    }} className="flex items-center space-x-3 p-3 border cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name={`question-${currentIndex}`}
                        value={idx}
                        checked={answers[currentIndex] === idx}
                        onChange={() => handleAnswerSelect(idx)}
                        style={{ display: 'none' }}
                      />
                        <span>{option.text}</span>
                    </label>
                  ))}
                </div>
              </div>
              ) : (
                 <div>
                   <h2 className="text-center mb-4 text-lg font-semibold">デバッグ用の仮結果ページ</h2>
                  <div className="mb-4">
                    <h3 className="text-center mb-2 text-md font-semibold">Total Summation</h3>
                    {Object.keys(calculateParameterSums()).sort((a, b) => parseInt(a.replace('param', '')) - parseInt(b.replace('param', ''))).map(key => (
                      <p key={key} className="text-center text-sm">{key}: {calculateParameterSums()[key]}</p>
                    ))}
                    <h3 className="text-center mb-2 text-md font-semibold">Condition Matching ({conditions.length} conditions loaded)</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full table-auto border-collapse border border-gray-300 text-xs">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-2 py-1 text-left">Redirect</th>
                            <th className="border border-gray-300 px-2 py-1 text-left">Condition</th>
                            <th className="border border-gray-300 px-2 py-1 text-left">Params</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const sums = calculateParameterSums();
                            return conditions.map((cond, idx) => {
                              if (!cond.text || typeof cond.text !== 'string') return null;
                              const matches = evaluateCondition(cond.text, sums);
                              // Extract unique parameter names from the original text that exist in sums
                              const paramMatches = [...cond.text.matchAll(/\b([\w-]+)\b/g)];
                              const usedParams = [...new Set(paramMatches.map(m => m[1]).filter(param => sums.hasOwnProperty(param)))];
                              const paramValues = usedParams.map(param => `${param}: ${sums[param] || 0}`).join(', ');
                              return (
                                <tr key={idx} className={matches ? '' : 'bg-red-100'}>
                                  <td className="border border-gray-300 px-2 py-1 font-semibold">{cond.redirect}</td>
                                  <td className="border border-gray-300 px-2 py-1 break-words">{cond.text}</td>
                                  <td className="border border-gray-300 px-2 py-1 break-words">{paramValues}</td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="text-center">
                    <Button
                      className="w-full text-white rounded-full py-6"
                      style={{ background: 'linear-gradient(to right, #00C37F, #01D0C6)' }}
                       onClick={() => {
                         const matched = getResultCharacter();
                         if (matched.length > 0) {
                           const title = matched[0].redirect; // Take the first match
                           navigate(`/quiz/result/${title.replace(/\//g, '-')}`);
                         } else {
                           navigate(`/quiz/result/マンジャロ`);
                         }
                       }}
                    >
                      結果を見る
                    </Button>
                    {matchedResult && (
                      <p className="mt-4 text-center text-lg font-semibold">{matchedResult}</p>
                    )}
                  </div>
                </div>
              )}
          </div>
          {currentIndex < quizData.length ? (
            <div style={{ width: '75%', margin: '20px auto 0' }}>
              {errorMessage && (
                <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
                  {errorMessage}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                <div
                  style={{
                    background: 'linear-gradient(to right, #00C37F, #01D0C6)',
                    color: 'white',
                    width: '100%',
                    height: '60px',
                    borderRadius: '30px',
                    cursor: answers[currentIndex] === null ? 'not-allowed' : 'pointer',
                    opacity: answers[currentIndex] === null ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 20px'
                  }}
                  onClick={handleNext}
                >
                  <span style={{ flex: 1, textAlign: 'center' }}>次へ</span><span>{'>'}</span>
                </div>
                {currentIndex > 0 && (
                  <div
                    style={{
                      backgroundColor: 'white',
                      color: 'black',
                      width: '100%',
                      padding: '10px 20px',
                      border: '1px solid black',
                      borderRadius: '25px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onClick={handlePrevious}
                  >
                    <span>{'<'}</span><span style={{ flex: 1, textAlign: 'center' }}>戻る</span>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}