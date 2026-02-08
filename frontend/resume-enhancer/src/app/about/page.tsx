import Header from '../../components/header';

const About = () => {
  return (
    <div>
      <Header />
      <main style={{ padding: '2rem', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>About</h1>
          <p>About information coming soon...</p>
        </div>
      </main>
    </div>
  );
};

export default About;

