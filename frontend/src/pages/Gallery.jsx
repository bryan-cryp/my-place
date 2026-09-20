import { useEffect, useState } from 'react';
import api from '../services/api';
import SectionHeading from '../components/SectionHeading';
import { LoadingBlock, EmptyState } from '../components/StateViews';
import { fallbackImage } from '../config/images';

const categories = ['all', 'villa', 'bedrooms', 'pool', 'gardens', 'beach', 'living areas', 'outdoor spaces', 'diani'];

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    setLoading(true);
    const params = activeCategory !== 'all' ? { category: activeCategory } : {};
    api.get('/gallery', { params })
      .then(({ data }) => setImages(data.images))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <section className="section" style={{ paddingTop: 'clamp(4rem, 8vw, 6rem)' }}>
      <div className="container">
        <SectionHeading eyebrow="Gallery" title="A closer look at My Place" description="Villa, pool, gardens, and the beach beyond — updated as new photos come in." />

        <div className="toolbar" role="tablist" aria-label="Gallery categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className="icon-btn"
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              style={activeCategory === cat ? { background: 'var(--color-lagoon)', color: 'var(--color-white)', borderColor: 'var(--color-lagoon)' } : undefined}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading && <LoadingBlock lines={4} />}

        {!loading && images.length === 0 && (
          <EmptyState
            title="Photos coming soon"
            description="This category doesn't have any photos yet. Check back soon, or browse another category."
          />
        )}

        {!loading && images.length > 0 && (
          <div className="grid grid--3">
            {images.map((img) => (
              <figure key={img.id} style={{ margin: 0 }}>
                <img
                  src={img.image_url}
                  alt={img.title}
                  onError={(e) => { e.currentTarget.src = fallbackImage; }}
                  style={{ borderRadius: 'var(--radius-md)', height: '260px', width: '100%', objectFit: 'cover' }}
                />
                <figcaption style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--color-palm)' }}>{img.title}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
