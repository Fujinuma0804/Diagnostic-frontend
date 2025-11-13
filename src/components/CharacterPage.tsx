import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CharacterCard } from "./CharacterCard";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ApiCharacter {
  id: number;
  post_color: string;
  thumbnail_url: string;
  short_description: string;
  title: string;
}

interface Character {
  id: number;
  type: string;
  bgColor: string;
  description: string;
  image?: string;
}

export default function CharacterPage() {
  const navigate = useNavigate();
  const isDebug = import.meta.env.VITE_DEBUG === 'true';
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch(isDebug ? '/json/blogs.json' : `${import.meta.env.VITE_BACKEND_URL}/api/blogs`);
        if (!response.ok) throw new Error('Failed to fetch characters');
        const data: ApiCharacter[] = await response.json();
        console.log('API data:', data);
        const transformed: Character[] = data.map(item => ({
          id: item.id,
          type: item.title,
          bgColor: item.post_color,
          description: item.short_description,
          image: item.thumbnail_url
        })).sort((a, b) => a.id - b.id);
        setCharacters(transformed);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, [isDebug]);
  return (
    <div className="min-h-screen pb-8" style={{ backgroundColor: '#FFF5F5' }}>
    <div className="main-body" style={{ width: 'fit-content', margin: '0 auto', padding: '10px', backgroundColor: 'white', backgroundImage: 'linear-gradient(#F3F3F3 1px, transparent 1px), linear-gradient(90deg, #F3F3F3 1px, transparent 1px)', backgroundSize: '20px 20px', borderRadius: '23px' }}>
      {/* Header Section */}
      <div className="px-6 pt-8 pb-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-pink-400 text-center mb-4 header-1" style={{ fontFamily: 'cursive', textDecoration: 'underline', textDecorationColor: '#FF0000' }}>
            <ImageWithFallback
                src="https://i.ibb.co/7dmMQKcc/Group-212-1.png"
                alt="Character"
                className="w-full h-full object-cover-1"
              />
          </h1>
          <h1 className="text-pink-400 text-center mb-4 header-1" style={{ fontFamily: 'cursive', textDecoration: 'underline', textDecorationColor: '#FF0000' }}>
            <ImageWithFallback
                src="https://i.ibb.co/p9vbxmH/Group-212-2.png"
                alt="Character"
                className="w-full h-full object-cover-1"
              />
          </h1>

            <Button className="w-full text-white rounded-full py-6" style={{ fontSize:'20px', marginBottom: '50px', background: 'linear-gradient(to right, #00C37F, #01D0C6)' }} onClick={() => navigate('/quiz')}>
              今すぐ診断スタート
            </Button>
            <h3 className="text-center heading-1" style={{ fontSize: '22px', color: '#E5557F', marginBottom: '15px' }}>~ 性格×体質から導く ~</h3>
            <h3 className="text-center heading-2" style={{ fontSize: '22px', color: 'black', marginBottom: '17px' }}>あなた専用の <br/>メディカルダイエット診断</h3>
          <p className="text-center text-gray-600 text-sm mb-6 text-1" style={{ lineHeight: '30px' }}>
          筋トレや食事管理を頑張っても、<br/> なかなか続かない… <br/> そんなあなたにこそ「医療の力」を <br/> 味方にした新しいダイエットを選ぶ時かも。<br/><br/> ですが… <br/> ダイエットの方法は数えきれないほどあります。<br/> 本当に大切なのは <br/>「あなたに合う方法」を見つけること。 <br/> 自分に合った「確実に」・「効率的に」・「安全に」<br/> 成果を出すダイエット方法を導きます<br/>
          </p>
         </div>
       </div>

        <div className="max-w-md mx-auto px-6 mt-0">
         <div className="border-2 rounded-lg p-4 character-body" style={{ borderColor: '#E5557F', backgroundColor: 'white' }}>
         <Button className="w-full text-white rounded-full py-6" style={{ marginBottom: '15px', background: 'linear-gradient(to right, #E6577E, #F69755)' }} onClick={() => navigate('/quiz')}>
              診断について
        </Button>
        <p className="text-left text-gray-600 text-sm text-2" style={{ marginBottom: '13px' }}>たった5分で、あなたに合うメディカルダイエットを発見！20個の質問に答えるだけで、16のタイプからあなたに最も合うダイエット方法を診断します。</p>
        <div style={{ display: 'flex', gap: '4px' }}>
            <div style={{ flex: 1, backgroundColor: '#FFF5F5', borderRadius: '5px', margin: '2px',padding:"10px",fontWeight:'bold' }}><h2 className="text-center" style={{fontSize:'16px'}}>所要時間</h2><h1 className="text-center" style={{fontSize:'26px',color:'#E5587F',padding:'5px'}}>5<span style={{fontSize:'16px'}}>分</span></h1></div>
            <div style={{ flex: 1, backgroundColor: '#FFF5F5', borderRadius: '5px', margin: '2px',padding:"10px",fontWeight:'bold' }}><h2 className="text-center" style={{fontSize:'16px'}}>質問数</h2><h1 className="text-center" style={{fontSize:'26px',color:'#E5587F',padding:'5px'}}>20<span style={{fontSize:'16px'}}>問</span></h1></div>
            <div style={{ flex: 1, backgroundColor: '#FFF5F5', borderRadius: '5px', margin: '2px',padding:"10px",fontWeight:'bold'  }}><h2 className="text-center" style={{fontSize:'16px'}}>結果</h2><h1 className="text-center" style={{fontSize:'26px',color:'#E5587F',padding:'5px'}}>16<span style={{fontSize:'12px'}}>通り</span></h1></div>
          </div>
         </div>
       </div>

       {/* Green Button Before Character Cards */}
       <div className="max-w-md mx-auto px-6 mt-8">
         <Button className="w-full text-white rounded-full py-6" style={{ fontSize:'20px',marginBottom: '8px', background: 'linear-gradient(to right, #00C37F, #01D0C6)' }} onClick={() => navigate('/quiz')}>
           今すぐ診断スタート
         </Button>
       </div>

       {/* Character Variations Section */}
       <div className="max-w-md mx-auto px-6 mt-0">
         {/* Ribbon Image */}
         <img src="https://i.ibb.co/Tx36LLWk/image.png" alt="Ribbon" style={{ width: '60%', display: 'block', margin: '0 auto', position: 'relative', top: '22px', zIndex: '1000' }} />
         <div className="border-2 rounded-lg p-4 character-body" style={{ borderColor: '#E5557F', backgroundColor: 'white' }}>
          {loading ? (
            <p className="text-center">Loading characters...</p>
          ) : error ? (
            <p className="text-center text-red-500">Error: {error}</p>
          ) : (
            <>
              {(() => {
                const chunks = characters.reduce((chunks: Character[][], char, index) => {
                  if (index % 4 === 0) chunks.push([]);
                  chunks[chunks.length - 1].push(char);
                  return chunks;
                }, []);
                return chunks.map((chunk, chunkIndex) => (
                  <div key={chunkIndex}>
                    <div className="outer-div mb-5">
                      <div className="grid grid-cols-2 gap-4">
                        {chunk.map((character, index) => (
                          <CharacterCard
                            key={index}
                            type={character.type}
                            bgColor={character.bgColor}
                            description={character.description}
                            image={character.image}
                          />
                        ))}
                      </div>
                    </div>
                    {chunkIndex < chunks.length - 1 && <hr className="my-6" style={{ borderColor: '#E5557F' }} />}
                  </div>
                ));
              })()}
            </>
          )}
        </div>
       </div>

       {/* Bottom Green Button */}
       <div className="max-w-md mx-auto px-6 mt-8">
         <Button className="w-full text-white rounded-full py-6" style={{ fontSize:'20px',marginBottom: '50px', background: 'linear-gradient(to right, #00C37F, #01D0C6)' }} onClick={() => navigate('/quiz')}>
           今すぐ診断スタート
         </Button>
       </div>
     </div>
     </div>
   );
 }
