import { Suspense } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { getDesign } from './designs/registry';
import GalleryPage from './pages/GalleryPage';
import HenryPage from './designs/henry/HenryPage';

/** Carga lazy el diseño que corresponda al slug de la URL. */
function DesignRoute() {
  const { slug } = useParams();
  const design = slug ? getDesign(slug) : undefined;

  if (!design) return <Navigate to="/disenos" replace />;
  // El diseño principal vive en la raíz; evitamos la URL duplicada.
  if (design.slug === 'henry') return <Navigate to="/" replace />;

  const Design = design.component;
  return (
    <Suspense fallback={null}>
      <Design />
    </Suspense>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HenryPage />} />
      <Route path="/disenos" element={<GalleryPage />} />
      <Route path="/disenos/:slug" element={<DesignRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
