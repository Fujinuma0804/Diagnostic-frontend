import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ApiCharacter {
  id: number;
  post_color: string;
  thumbnail_url: string;
  short_description: string;
  title: string;
  result_img1: string;
  result_img2: string;
  result_img3: string;
  script_tag: string;
  referrer_url: string;
}

export default function ResultPage() {
  const { title: urlTitle } = useParams<{ title: string }>();
  const title = urlTitle?.replace(/-/g, '/') || '';
  const isDebug = import.meta.env.VITE_DEBUG === 'true';
  const [character, setCharacter] = useState<ApiCharacter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(isDebug ? '/json/blogs.json' : `${import.meta.env.VITE_BACKEND_URL}/api/blogs`);
        if (!response.ok) throw new Error('Failed to fetch characters');
        const data: ApiCharacter[] = await response.json();
        const found = data.find(c => c.title === title);
        setCharacter(found || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    if (title) fetchCharacter();
  }, [title, isDebug]);

  useEffect(() => {
    const timer = setTimeout(() => setShowOverlay(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (character?.script_tag) {
      // Remove existing script if any
      const existingScript = document.getElementById('dynamic-script');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      // Parse the script_tag HTML and append the script element
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = character.script_tag;
      const scriptElement = tempDiv.firstElementChild as HTMLScriptElement;
      if (scriptElement && scriptElement.tagName === 'SCRIPT') {
        scriptElement.id = 'dynamic-script';
        document.body.appendChild(scriptElement);
      }
    }
    return () => {
      // Cleanup on unmount
      const script = document.getElementById('dynamic-script');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [character]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return (
    <div className="pb-8" style={{ backgroundColor: '#FFF5F5', minHeight: '500px' }}>
      <div className="main-body" style={{ width: 'fit-content', margin: '0 auto', padding: '10px', backgroundColor: 'white', backgroundImage: 'linear-gradient(#F3F3F3 1px, transparent 1px), linear-gradient(90deg, #F3F3F3 1px, transparent 1px)', backgroundSize: '20px 20px', borderRadius: '23px' }}>
        <div className="px-6 pt-8 pb-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-pink-400 text-center mb-4 header-1" style={{ fontFamily: 'cursive', textDecoration: 'underline', textDecorationColor: '#FF0000', display: 'none' }}>
              <ImageWithFallback
                src="https://i.ibb.co/QgmZYVn/Group-67.png"
                alt="Character"
                className="w-full h-full object-cover-1"
              />
            </h1>
            <p className="text-center text-red-500">あなたは間違ったページにいます</p>
          </div>
        </div>
      </div>
    </div>
  );
  if (!character) return (
    <div className="min-h-screen pb-8" style={{ backgroundColor: '#FFF5F5' }}>
      <div className="main-body" style={{ width: 'fit-content', margin: '0 auto', padding: '10px', backgroundColor: 'white', backgroundImage: 'linear-gradient(#F3F3F3 1px, transparent 1px), linear-gradient(90deg, #F3F3F3 1px, transparent 1px)', backgroundSize: '20px 20px', borderRadius: '23px' }}>
        <div className="px-6 pt-8 pb-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-pink-400 text-center mb-4 header-1" style={{ fontFamily: 'cursive', textDecoration: 'underline', textDecorationColor: '#FF0000', display: 'none' }}>
              <ImageWithFallback
                src="https://i.ibb.co/QgmZYVn/Group-67.png"
                alt="Character"
                className="w-full h-full object-cover-1"
              />
            </h1>
            <h2 className="text-center text-lg font-semibold mb-4">404 - 見つかりません</h2>
            <p className="text-center text-gray-600">リクエストされたキャラクターが見つかりませんでした。</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-8" style={{ backgroundColor: '#FFF5F5' }}>
      <div className="main-body" style={{ width: 'fit-content', margin: '0 auto', padding: '0', backgroundColor: 'white', backgroundImage: 'linear-gradient(#F3F3F3 1px, transparent 1px), linear-gradient(90deg, #F3F3F3 1px, transparent 1px)', backgroundSize: '20px 20px', borderRadius: '23px' }}>
        <div className="px-6 pt-8 pb-6">
          <div className="max-w-md mx-auto">
            <div className="text-center" style={{ marginBottom: '20px' }}>
              <ImageWithFallback
                src="https://i.ibb.co/B2FdYNTB/Group-213.png"
                alt="Character"
                className="h-full object-cover-1"
                style={{ width: '90%' }}
              />
            </div>
            <hr style={{ width: '100%', border: 'none', background: 'transparent', height: '1px' }} />
            <div className="grid grid-cols-2 gap-2" style={{ marginBottom: '20px', position: 'relative' }}>
              {showOverlay && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(128,128,128,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, borderRadius: '5px' }}>
                  <div style={{ position: 'relative', width: '60px', height: '60px', marginBottom: '20px' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40px', height: '40px', border: '4px solid transparent', borderTop: '4px solid #ff0000', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '30px', height: '30px', border: '3px solid transparent', borderTop: '3px solid #00ff00', borderRadius: '50%', animation: 'spin 0.8s linear infinite reverse' }}></div>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20px', height: '20px', border: '2px solid transparent', borderTop: '2px solid #0000ff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>
                  </div>
                  <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>「診断結果を計算中…」</span>
                  <style>{`
                    @keyframes spin {
                      0% { transform: translate(-50%, -50%) rotate(0deg); }
                      100% { transform: translate(-50%, -50%) rotate(360deg); }
                    }
                  `}</style>
                </div>
              )}
              {/* Block 1: For text later */}
              <div className="flex items-center justify-center" style={{ minHeight: '200px', borderRadius: '5px', background: 'linear-gradient(to right, #E6577D, #F69954)', padding: '2px' }}>
                <div style={{ background: 'white', borderRadius: '5px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                   <p style={{ flex: 1, color: 'white', fontWeight: 'bold', background: 'linear-gradient(to right, #E6577D, #F69954)', margin: 0, padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 'clamp(12px, 2.5vw, 18px)' }}>診断結果から分かること</p>
                    <p style={{ flex: 1, margin: '4px', padding: '5px', display: 'flex', alignItems: 'center', backgroundColor: '#FFF5F5', borderRadius: '5px', fontSize: 'clamp(11px, 2vw, 16px)', fontWeight: 'bold' }}>8項目×5段階の適正評価</p>
                    <p style={{ flex: 1, margin: '4px', padding: '5px', display: 'flex', alignItems: 'center', backgroundColor: '#FFF5F5', borderRadius: '5px', fontSize: 'clamp(11px, 2vw, 16px)', fontWeight: 'bold' }}>あなたの性格・体質の特徴</p>
                    <p style={{ flex: 1, margin: '4px', padding: '5px', display: 'flex', alignItems: 'center', backgroundColor: '#FFF5F5', borderRadius: '5px', fontSize: 'clamp(11px, 2vw, 16px)', fontWeight: 'bold' }}>ダイエット法の効果効能</p>
                    <p style={{ flex: 1, margin: '4px', padding: '5px', display: 'flex', alignItems: 'center', backgroundColor: '#FFF5F5', borderRadius: '5px', fontSize: 'clamp(11px, 2vw, 16px)', fontWeight: 'bold' }}>あなたにおすすめな理由</p>
                </div>
              </div>
               {/* Block 2: result_image1 */}
               <div style={{ borderRadius: '5px', position: 'relative' }}>
                 <ImageWithFallback
                   src={character.result_img1}
                   alt="Result Image 1"
                   className="w-full h-full object-cover"
                   style={{ borderRadius: '5px', filter: 'blur(3px)' }}
                 />
                 <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '5px' }}></div>
               </div>
               {/* Block 3: result_img2 */}
               <div style={{ borderRadius: '5px', position: 'relative' }}>
                 <ImageWithFallback
                   src={character.result_img2}
                   alt="Result Image 2"
                   className="w-full h-full object-cover"
                   style={{ borderRadius: '5px', filter: 'blur(3px)' }}
                 />
                 <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '5px' }}></div>
               </div>
               {/* Block 4: result_img3 */}
               <div style={{ borderRadius: '5px', position: 'relative' }}>
                 <ImageWithFallback
                   src={character.result_img3}
                   alt="Result Image 3"
                   className="w-full h-full object-cover"
                   style={{ borderRadius: '5px', filter: 'blur(3px)' }}
                 />
                 <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '5px' }}></div>
               </div>
            </div>

            {/* Additional Text Block */}
            <div className="max-w-md mx-auto mt-8" style={{ display: showOverlay ? 'none' : 'block' }}>
              <div style={{ border: '2px solid rgb(255, 245, 245)', backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: 'rgb(255, 212, 224) 0px 0px 13.8px', overflow: 'hidden' }}>
                <h1 style={{ color: '#E5557F', textAlign: 'center', margin: '15px', fontSize: '20px' }}>{'\\ LINEで結果を見る /'}</h1>
                <p style={{ textAlign: 'center', fontSize: '15px', lineHeight: '1.5' }}>あなただけの</p>
                <p style={{ textAlign: 'center', fontSize: '15px', lineHeight: '1.5' }}>タイプ診断結果を見てみよう</p>
                 <a href={character.referrer_url} style={{ display: 'block', width: '100%', textAlign: 'center', color: 'white', background: '#0DC755', padding: '12px 24px', borderRadius: '9999px', textDecoration: 'none', marginTop: '10px' }}>診断結果を見る</a>
                <p style={{ marginTop: '20px', textAlign: 'left', fontSize: '15px' }}>新規会員登録またはログインすることにより、<a href="#" style={{ color: '#006DD9' }}>利用規約</a>および<a href="#" style={{ color: '#006DD9' }}>個人情報保護方針</a>に同意したものとみなされます。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}