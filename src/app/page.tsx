import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-50 to-white text-gray-800">
      
      {/* Container */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        
        <div className="grid md:grid-cols-2 items-center gap-12">

          {/* LEFT SIDE */}
          <div className="space-y-6 relative mt-10 h-40">

            {/* Cercle */}
            <div className="absolute top-5 left-4 w-3 h-3 bg-black rounded-full animate-float z-0"></div>

            {/* Carré */}
            <div className="absolute top-12 left-20 w-3 h-3 bg-blue-600 animate-float z-0"></div>

            {/* Triangle */}
            <div className="absolute top-24 left-10 triangle animate-float z-0"></div>

            {/* Cercle */}
            <div className="absolute top-16 left-32 w-2 h-2 bg-gray-700 rounded-full animate-float z-0"></div>

            {/* Carré */}
            <div className="absolute top-28 left-48 w-4 h-4 bg-blue-400 animate-float"></div>

            {/* Cercle */}
            <div className="absolute top-50 left-2 w-3 h-3 bg-black rounded-full animate-float z-0"></div>

            {/* Carré */}
            <div className="absolute top-30 left-10 w-3 h-3 bg-blue-600 animate-float z-0"></div>

            {/* Triangle */}
            <div className="absolute top-40 right-5 triangle animate-float z-0"></div>

            {/* Cercle */}
            <div className="absolute top-10 right-10 w-2 h-2 bg-gray-700 rounded-full animate-float z-0"></div>

            {/* Carré */}
            <div className="absolute top-28 right-48 w-4 h-4 bg-blue-400 animate-float"></div>

            <h1 className="text-4xl md:text-5xl font-bold text-blue-950 leading-tight">
              RAKOTONANDRIANINA <br />
              <span className="text-blue-600">
                Charles Patrick
              </span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              Je suis Charles Patrick, développeur Full Stack et étudiant
              en première année de Master Professionnel à l’École Nationale
              d’Informatique — Université de Fianarantsoa, Madagascar.
            </p>

            {/* Buttons */}
            <div className="flex gap-4">
              
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition">
                Voir mes projets
              </button>

              <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition">
                Contact
              </button>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="md:flex justify-center md:relative items-center">

            {/* background shape */}
            <div className="absolute w-200 h-200 bg-blue-600 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute w-30 h-30 bg-blue-500 rounded-full top-50 right-7 animate-ping"></div>
            <div className="absolute w-50 h-50 bg-blue-400 rounded-full top-70 right-3"></div>
            <div className="absolute w-10 h-10 bg-blue-100 rounded-full top-3 left-7 animate-ping"></div>
            <div className="absolute w-10 h-10 bg-blue-100 rounded-full top-10 right-10 animate-float2"></div>
            <div className="absolute w-20 h-20 bg-blue-100 rounded-full top-20 right-20 animate-float2"></div>
            <div className="absolute w-30 h-30 bg-blue-100 rounded-full top-30 right-30 animate-float2"></div>
            <div className="absolute w-20 h-20 bg-blue-100 rounded-full bottom-5 left-5 animate-float2"></div>
            <div className="absolute w-10 h-10 bg-blue-100 rounded-full bottom-20 left-20 animate-float2"></div>
            <div className="absolute w-5 h-5 bg-blue-100 rounded-full bottom-60 left-60 animate-float2"></div>

            <div className="absolute w-1 h-1 bg-black rounded-full top-80 left-2 animate-float"></div>
            <div className="absolute w-1 h-1 bg-black rounded-full top-85 left-0.5 animate-float2"></div>
            <div className="absolute w-1 h-1 bg-black rounded-full top-90 left-0.1 animate-float2"></div>
            <div className="absolute w-1 h-1 bg-black rounded-full top-50 left-6 animate-float"></div>
            <div className="absolute w-1 h-1 bg-black rounded-full top-60 left-7 animate-float"></div>
            <div className="absolute w-1 h-1 bg-black rounded-full top-70 left-3 animate-float"></div>
            <div className="absolute w-1 h-1 bg-black rounded-full top-80 left-1 animate-float2"></div>
            <div className="absolute w-1 h-1 bg-black rounded-full top-50 left-9 animate-float2"></div>
            <div className="absolute w-1 h-1 bg-black rounded-full top-65 left-1 animate-float2"></div>
            <div className="absolute w-1 h-1 bg-black rounded-full top-40 left-10 animate-float2"></div>
            <div className="absolute w-1 h-1 bg-black rounded-full top-48 left-5 animate-float"></div>
            <div className="absolute w-1 h-1 bg-black rounded-full top-45 left-4 animate-float"></div>
            <div className="absolute w-1 h-1 bg-black rounded-full top-55 left-3 animate-float2"></div>
            <div className="absolute w-1 h-1 bg-black rounded-full top-90 left-2 animate-float2"></div>
            <div className="absolute w-1 h-1 bg-black rounded-full top-100 left-1 animate-float2"></div>


            <Image
              src="/images/profile.jpg"
              alt="profile"
              width={300}
              height={300}
              className="rounded-full object-cover"
            />
          </div>

        </div>
      </section>
    </main>
  );
}