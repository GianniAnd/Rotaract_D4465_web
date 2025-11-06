import { useState, useEffect } from 'react';
import '../App.css';
import './LandingPage.css';
import NavBar from '../components/NavBar';

const LandingPage = () => {
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  // replaced rotating gear with a static card grid; keep state placeholders removed
  // (no rotation state needed for the new layout)

  const rotaryFocuses = [
    {
      title: 'Paz y Prevención/Resolución de Conflictos',
      icon: '☮️',
      description: 'Promovemos la paz y el entendimiento entre comunidades.'
    },
    {
      title: 'Prevención y Tratamiento de Enfermedades',
      icon: '⚕️',
      description: 'Apoyamos la salud y el bienestar de las comunidades.'
    },
    {
      title: 'Agua y Saneamiento',
      icon: '💧',
      description: 'Garantizamos el acceso a agua potable y saneamiento básico.'
    },
    {
      title: 'Salud Materno Infantil',
      icon: '👨‍👩‍👧‍👦',
      description: 'Protegemos la salud de madres e hijos.'
    },
    {
      title: 'Educación Básica y Alfabetización',
      icon: '📚',
      description: 'Fomentamos la educación de calidad para todos.'
    },
    {
      title: 'Desarrollo Económico Comunitario',
      icon: '💼',
      description: 'Impulsamos el crecimiento económico sostenible.'
    },
    {
      title: 'Medio Ambiente',
      icon: '🌱',
      description: 'Protegemos nuestro planeta para las futuras generaciones.'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setNavbarScrolled(window.scrollY > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  

  return (
    <div className="app">
      {/* Navigation Bar */}
      <div className={navbarScrolled ? 'navbar scrolled' : 'navbar'}>
        <NavBar />
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay-dark"></div>
        <div className="hero-overlay-red"></div>
        <img 
          src="https://api.builder.io/api/v1/image/assets/TEMP/722a988afc24c9d265123ec1217424cbea5a3927?width=3138" 
          alt="Rotaract Group" 
          className="hero-image"
        />
        <div className="hero-content">
          <h1 className="hero-title">Rotaract Distrito 4465 - Perú</h1>
          <p className="hero-subtitle">
            Jóvenes líderes comprometidos con el servicio comunitario, 
            el desarrollo profesional y la paz mundial.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="quienes-somos">
        <div className="section-header">
          <h2 className="section-title">¿Quiénes somos?</h2>
        </div>
        <h3 className="about-main-title">Jóvenes líderes al servicio de la comunidad</h3>
        <p className="about-description">
          Rotaract es una organización mundial de jóvenes adultos patrocinada por Rotary International.
          En el Distrito 4465, que comprende Perú, somos más de 1,200 jóvenes comprometidos con
          el servicio comunitario, el desarrollo profesional y el liderazgo.
        </p>
      </section>

      {/* Impact Cards Section */}
      <section className="dashboard-section">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/0dba76569d00dacf6aed0b2600488f02da40e002?width=2872"
          alt="Rotaract Activities"
          className="dashboard-background"
        />
        <h2 className="section-title-dark">Nuestro Impacto en Números</h2>
        <div className="impact-cards-grid">
          <div className="impact-card">
            <div className="impact-card-icon">👥</div>
            <div className="impact-card-content">
              <h3 className="impact-card-title">Miembros Activos</h3>
              <p className="impact-card-number">1,200+</p>
              <p className="impact-card-description">Jóvenes rotaractianos comprometidos con el cambio positivo en todo Perú, representando diversas profesiones y sectores.</p>
            </div>
          </div>

          <div className="impact-card">
            <div className="impact-card-icon">🏢</div>
            <div className="impact-card-content">
              <h3 className="impact-card-title">Clubes</h3>
              <p className="impact-card-number">45+</p>
              <p className="impact-card-description">Clubes distribuidos estratégicamente en el Distrito 4465, creando redes de servicio y generando cambio comunitario.</p>
            </div>
          </div>

          <div className="impact-card">
            <div className="impact-card-icon">🎯</div>
            <div className="impact-card-content">
              <h3 className="impact-card-title">Proyectos Anuales</h3>
              <p className="impact-card-number">150+</p>
              <p className="impact-card-description">Ejecutamos proyectos enfocados en las áreas de enfoque de Rotary, transformando realidades y generando impacto duradero.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Gallery Section */}
      <section className="gallery-modern">
        <h2 className="section-title-dark">Galería de Impacto</h2>
        <p className="gallery-intro">Historias y proyectos destacados que muestran el cambio que generamos en nuestras comunidades.</p>

        <div className="gallery-modern-grid">
          <div className="gm-large">
            <img src="https://images.unsplash.com/photo-1509099836639-18ba87e3c3d6?w=1400&h=900&fit=crop" alt="Proyecto destacado" />
            <div className="gm-caption"><h3>Proyecto destacado</h3><p>Transformando vidas en comunidades rurales</p></div>
          </div>

          <div className="gm-column">
            <div className="gm-item">
              <img src="https://images.unsplash.com/photo-1520975685541-0a2f79e0b6c8?w=800&h=600&fit=crop" alt="Voluntariado" />
              <div className="gm-caption">Voluntariado — campañas de salud</div>
            </div>
            <div className="gm-item">
              <img src="https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=800&h=600&fit=crop" alt="Educación" />
              <div className="gm-caption">Educación — programas en escuelas</div>
            </div>
          </div>

          <div className="gm-column">
            <div className="gm-item">
              <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop" alt="Sostenibilidad" />
              <div className="gm-caption">Sostenibilidad — iniciativas verdes</div>
            </div>
            <div className="gm-item">
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop" alt="Comunidad" />
              <div className="gm-caption">Comunidad — trabajo colaborativo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean 7 Areas Grid */}
      <section className="areas-section" id="proyectos">
        <h2 className="section-title-dark">Las 7 Áreas de Enfoque</h2>
        <p className="focuses-intro">Nuestros proyectos se organizan en estas áreas prioritarias para lograr impacto sostenible.</p>

        <div className="areas-grid">
          {rotaryFocuses.map((f, i) => (
            <article className="area-card" key={f.title}>
              <div className="area-card-icon">{f.icon}</div>
              <h3 className="area-card-title">{f.title}</h3>
              <p className="area-card-desc">{f.description}</p>
              <a className="area-card-link" href={`#proyecto-${i+1}`}>Ver proyectos</a>
            </article>
          ))}
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="mission-vision-section">
        <div className="mission-vision-container">
          <div className="mission-card">
            <h2 className="mission-title">Nuestra Misión</h2>
            <p className="mission-text">
              Brindar oportunidades a jóvenes para desarrollar su liderazgo y habilidades profesionales 
              a través del servicio comunitario, creando proyectos que generen un impacto positivo 
              y sostenible en el Perú y el mundo.
            </p>
          </div>
          <div className="vision-card">
            <h2 className="vision-title">Nuestra Visión</h2>
            <p className="vision-text">
              Ser reconocidos como la organización de jóvenes líderes más influyente del Perú, 
              impulsando el cambio social a través del servicio, la innovación y el compromiso 
              con los valores de Rotary International.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-wrapper">
          <div className="footer-top">
            <div className="footer-section footer-branding">
              <div className="footer-logo-box">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/69484d16ca0afae22dd6aa3eb937859f7b4571de?width=312" 
                  alt="Rotaract Logo" 
                  className="footer-logo"
                />
              </div>
              <h3 className="footer-brand-text">Rotaract Distrito 4465</h3>
              <p className="footer-tagline">Jóvenes líderes al servicio de la comunidad</p>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Enlaces Rápidos</h4>
              <ul className="footer-links">
                <li><a href="#about">Acerca de</a></li>
                <li><a href="#proyectos">Proyectos</a></li>
                <li><a href="#contact">Contacto</a></li>
                <li><a href="#clubs">Clubes</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Información</h4>
              <ul className="footer-links">
                <li><a href="#privacy">Política de Privacidad</a></li>
                <li><a href="#terms">Términos de Servicio</a></li>
                <li><a href="#help">Ayuda</a></li>
                <li><a href="#faq">Preguntas Frecuentes</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Contacto</h4>
              <div className="footer-contact">
                <p>📍 Av. Ejemplo 123, Lima, Perú</p>
                <p>📞 +51 (1) 999 999 999</p>
                <p>✉️ info@rotaract4465.org</p>
              </div>
              <div className="footer-socials">
                <a href="#facebook" className="social-link">f</a>
                <a href="#instagram" className="social-link">📷</a>
                <a href="#linkedin" className="social-link">in</a>
                <a href="#twitter" className="social-link">𝕏</a>
              </div>
            </div>
          </div>

          <div className="footer-divider"></div>

          <div className="footer-bottom">
            <p>&copy; 2025 Rotaract Distrito 4465. Todos los derechos reservados.</p>
            <p>Patrocinado por Rotary International</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
