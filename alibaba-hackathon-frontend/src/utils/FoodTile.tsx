import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

interface FoodRecommendation {
  id: number;
  name: string;
  description: string;
  reason: string;
}

export default function FoodTile() {
  const [curhatan, setCurhatan] = useState('');
  const [recommendations, setRecommendations] = useState<FoodRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const navigate = useNavigate();

  const fetchRecommendations = async (userInput: string): Promise<FoodRecommendation[]> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (Math.random() < 0.1) {
      throw new Error('Gagal mendapatkan rekomendasi. Silakan coba lagi.');
    }

    const dummyRecommendations: FoodRecommendation[] = [
      {
        id: 1,
        name: 'Nasi Gudeg',
        description: 'Makanan tradisional Yogyakarta dengan cita rasa manis dan gurih',
        reason: 'Makanan comfort food yang bisa menenangkan pikiran'
      },
      {
        id: 2,
        name: 'Soto Ayam',
        description: 'Sup ayam hangat dengan bumbu rempah yang kaya',
        reason: 'Makanan hangat yang cocok untuk menghangatkan hati'
      },
      {
        id: 3,
        name: 'Es Cendol',
        description: 'Minuman dingin dengan santan dan gula merah',
        reason: 'Makanan manis untuk memperbaiki mood'
      }
    ];

    if (userInput.length > 100) {
      dummyRecommendations.push(
        {
          id: 4,
          name: 'Rendang',
          description: 'Daging sapi dengan bumbu rempah yang kuat',
          reason: 'Makanan berenergi untuk semangat baru'
        },
        {
          id: 5,
          name: 'Bakso',
          description: 'Sup bakso daging dengan mie dan sayuran',
          reason: 'Makanan hangat yang mengenyangkan dan menenangkan'
        }
      );
    }

    return dummyRecommendations;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!curhatan.trim()) {
    setError('Mohon isi curhatan terlebih dahulu');
    return;
  }

  setIsLoading(true);
  setError('');
  setHasSubmitted(true);

  try {
    const results = await fetchRecommendations(curhatan);
    setRecommendations(results);

    navigate('/food-detail', { state: results });

  } catch (err) {
    setError(err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui');
    setRecommendations([]);
  } finally {
    setIsLoading(false);
  }
};
  

  const handleReset = () => {
    setCurhatan('');
    setRecommendations([]);
    setError('');
    setHasSubmitted(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header>
        <h1>NALA</h1>
        <p>Ceritakan perasaan Anda, dapatkan rekomendasi makanan yang tepat!</p>
      </header>

      <main>
        <section>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="curhatan" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Ceritakan perasaan atau situasi Anda saat ini:
              </label>
              <textarea
                id="curhatan"
                value={curhatan}
                onChange={(e) => setCurhatan(e.target.value)}
                placeholder="Contoh: Hari ini saya merasa stress karena deadline pekerjaan yang menumpuk..."
                rows={5}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #ccc', 
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <button 
                onClick={handleSubmit}
                type="submit" 
                disabled={isLoading}
                style={{ 
                  padding: '12px 24px', 
                  backgroundColor: isLoading ? '#ccc' : '#007bff',
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  marginRight: '8px'
                }}
              >
                {isLoading ? 'Mencari Rekomendasi...' : 'Dapatkan Rekomendasi'}
              </button>
              
              {hasSubmitted && (
                <button 
                  type="button" 
                  onClick={handleReset}
                  style={{ 
                    padding: '12px 24px', 
                    backgroundColor: '#6c757d',
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </section>

        {error && (
          <section>
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#f8d7da', 
              border: '1px solid #f5c6cb', 
              borderRadius: '4px', 
              color: '#721c24',
              marginBottom: '16px'
            }}>
              <strong>Error:</strong> {error}
            </div>
          </section>
        )}

        {isLoading && (
          <section>
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              marginBottom: '16px'
            }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #007bff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }} />
              <p>Sedang mencari rekomendasi makanan yang tepat untuk Anda...</p>
            </div>
          </section>
        )}

        {recommendations.length > 0 && !isLoading && (
          <section>
            <h2>Rekomendasi Makanan untuk Anda</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {recommendations.map((food) => (
                <article 
                  key={food.id}
                  style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    padding: '16px',
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{food.name}</h3>
                  <p style={{ margin: '0 0 8px 0', color: '#666' }}>{food.description}</p>
                  <div style={{ 
                    padding: '8px', 
                    backgroundColor: '#e7f3ff', 
                    borderRadius: '4px',
                    borderLeft: '4px solid #007bff'
                  }}>
                    <strong>Mengapa cocok untuk Anda:</strong> {food.reason}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {hasSubmitted && recommendations.length === 0 && !isLoading && !error && (
          <section>
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              color: '#6c757d'
            }}>
              <p>Tidak ada rekomendasi yang ditemukan. Silakan coba lagi dengan cerita yang berbeda.</p>
            </div>
          </section>
        )}
      </main>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}