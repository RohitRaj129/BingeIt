export default function AboutPage() {
  return (
    <div className="px-6 py-12 max-w-4xl mx-auto text-white">
      <div className="flex justify-start mb-6">
        <a href="/" className="block">
          <img src="/logo.png" alt="BingeIt Logo" className="h-10 w-auto" />
        </a>
      </div>
      <h1 className="text-4xl font-bold mb-6 text-center">About BingeIt</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Welcome to BingeIt</h2>
        <p className="text-lg leading-relaxed">
          Your ultimate companion for discovering the best in entertainment.
          Whether you're a movie buff or a series junkie, BingeIt brings a
          seamless and immersive way to explore, browse, and enjoy top-rated
          movies and TV shows across genres.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">What We Do</h2>
        <ul className="list-disc pl-6 space-y-1 text-lg">
          <li>Browse movies and TV shows with rich details</li>
          <li>Filter by genre, popularity, and ratings</li>
          <li>Explore trending, upcoming, and all-time favorites</li>
          <li>Enjoy smooth carousel-based browsing for quick navigation</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Tech Behind the Magic</h2>
        <ul className="list-disc pl-6 space-y-1 text-lg">
          <li>
            <strong>Frontend:</strong> Next.js, TypeScript, Tailwind CSS
          </li>
          <li>
            <strong>State Management:</strong> React Context API
          </li>
          <li>
            <strong>API Integration:</strong> TMDB API
          </li>
          <li>
            <strong>UI/UX:</strong> Beautiful animations and responsive design
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Why Users Love Us</h2>
        <ul className="list-disc pl-6 space-y-1 text-lg">
          <li>Simple and intuitive UI</li>
          <li>Clean categorization of content</li>
          <li>Superfast performance and loading</li>
          <li>Designed for mobiles, tablets, and desktops</li>
          <li>No clutter. Just pure entertainment browsing.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
        <ul className="list-disc pl-6 space-y-1 text-lg">
          <li>Personalized watchlists and recommendations</li>
          <li>Community features like reviews and ratings</li>
          <li>Smarter search and genre discovery</li>
          <li>A growing library of global content</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Let’s Connect!</h2>
        <p className="text-lg leading-relaxed">
          Have feedback, ideas, or a partnership in mind? We’d love to hear from
          you. Drop us a message or follow our journey as we build the future of
          entertainment discovery.
        </p>
        <div className="mt-4 text-lg space-y-2">
          <p>
            Email:{" "}
            <a
              href="mailto:contactusbingeit@gmail.com"
              className="text-blue-400 hover:underline"
            >
              contactusbingeit@gmail.com
            </a>
          </p>
          <p>
            Follow us on X:{" "}
            <a
              href="https://x.com/BingeItSupport"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              @BingeItSupport
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
