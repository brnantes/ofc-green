
const ContactForm = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-poker-gray-medium border-poker-gold/20 rounded-lg p-8 text-center animate-fade-in">
          <h3 className="text-2xl font-bold text-green-primary mb-4">Siga nosso Instagram!</h3>
          <p className="text-gray-300 text-lg mb-4">
            Para novidades, fotos dos eventos e contato direto, siga nosso perfil:
          </p>
          <a
            href="https://instagram.com/greentableclub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            @greentableclub
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
