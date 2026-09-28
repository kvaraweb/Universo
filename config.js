// PERSONALIZA AQUÍ. Rutas relativas a dist/, por ejemplo: assets/nosotros.jpg.
// Los capítulos se recorren en el orden de este arreglo. Conserva exactamente siete.
window.UNIVERSE = {
  name: 'mi amor',
  sampleContent: false,
  music: '', // MP3 opcional; sin archivo se reproduce un ambiente sintetizado.
  intro: ['Bienvenida a un pequeño universo que hice para ti.', 'Hay 7 estrellas que quiero que descubras.'],
  finalPrelude: 'De todas las estrellas de este universo…',
  finalMessage: '…mi favorita siempre vas a ser tú.',
  birthday: 'Feliz cumpleaños, {nombre}.',
  // Coordenadas normalizadas de los siete vértices del corazón.
  constellation: [[0,-0.35],[-0.46,-0.75],[-0.86,-0.25],[-0.55,0.4],[0,0.95],[0.68,0.26],[0.62,-0.72]],
  chapters: [
    {title:'El comienzo',date:'DONDE TODO EMPEZÓ',text:['Hay personas que llegan sin hacer ruido y terminan cambiándolo todo. Tú fuiste una de ellas.','Si pudiera volver a ese primer instante, me quedaría un poquito más. Solo para ver otra vez cómo empieza mi parte favorita de la historia.'],quote:'Qué suerte la mía, coincidir contigo.',photos:[],video:'',audio:''},
    {title:'La amistad',date:'ANTES DE SABERLO',text:['Antes de ser nosotros, fuimos conversaciones que no queríamos terminar. Risas sin motivo. La tranquilidad de poder ser uno mismo.','Sin darnos cuenta, construimos un lugar al que siempre queríamos volver.'],quote:'Ya eras mi lugar favorito, aunque todavía no lo sabía.',photos:[],video:'',audio:''},
    {title:'El cambio',date:'CUANDO ALGO EMPEZÓ A BRILLAR',text:['No sé en qué momento exacto cambió todo. Quizás fue una mirada un poco más larga, o esas ganas de contarte primero cualquier cosa.','Lo que sí sé es que un día, pensar en el futuro empezó a parecerse mucho a pensar en ti.'],quote:'Y de pronto, todas las canciones tenían algo de ti.',photos:[],video:'',audio:''},
    {title:'Nosotros',date:'NUESTRA FECHA ESPECIAL',text:['Elegirte fue el comienzo de algo que sigo eligiendo cada día. Con nuestras maneras distintas de mirar el mundo y esa forma tan nuestra de encontrarnos.','No hace falta que todo sea perfecto. Me basta con que lo sigamos construyendo juntos.'],quote:'Mi sí más bonito siempre será a nosotros.',photos:[],video:'',audio:''},
    {title:'Nuestros recuerdos',date:'LO PEQUEÑO QUE SE VOLVIÓ ENORME',text:['Hay momentos que no necesitan ser extraordinarios para quedarse para siempre. Una tarde, una canción, una risa que todavía puedo escuchar.'],quote:'Contigo, hasta un día cualquiera merece recordarse.',photos:[],galleryPlaceholder:false,video:'',audio:''},
    {title:'Gracias',date:'POR TODO LO QUE ERES',text:['Gracias por tu forma de estar. Por escuchar, por compartir tus días conmigo y por dejarme acompañarte en los míos.','Gracias por las risas y también por los momentos en los que nos toca aprender. Por lo que ya vivimos, por lo que cuidamos y por todo lo que todavía estamos construyendo.'],quote:'La vida se siente más bonita desde que estás en ella.',photos:[],video:'',audio:''},
    {title:'El futuro',date:'TODO LO QUE NOS QUEDA',text:['Todavía hay lugares por conocer, canciones por descubrir y muchísimos días pequeños que quiero vivir contigo.','No conozco cada cosa que nos espera. Pero cuando imagino todo lo bonito que podría venir, siempre apareces tú.'],quote:'Lo nuestro tiene muchas estrellas por encender.',photos:[],video:'',audio:''}
  ],
  epilogue: {
    title:'Siete estrellas. Un solo destino: tú.',
    text:'Gracias por recorrer este pequeño universo conmigo. Cada luz se queda encendida, guardando un pedacito de nuestra historia, hasta la próxima aventura.',
    signature:'Feliz cumpleaños, {nombre}. Con todo mi amor.'
  },
  gift: {
    title:'Tu sorpresa sigue en órbita',
    text:'Reporte del centro de misión: una perturbación inesperada en el campo gravitacional —una fuerza mayor, fuera de nuestro control— interrumpió la trayectoria de tu sorpresa justo antes de llegar a ti.',
    placeholder:false,
    photos:[],video:'',audio:'',link:'',linkLabel:'Descubrir mi regalo',location:'',
    letter:'La misión sigue en pie. Estamos recalculando la órbita y ajustando las coordenadas para resolver el contratiempo. Lo solucionaremos, y pronto tu sorpresa estará lista para aterrizar.\nHasta entonces, queda en una órbita de espera, custodiada por estas siete estrellas.\nHay algo que ninguna anomalía puede alterar: la ilusión con la que preparé esto para ti. Incluso cuando el universo cambia los planes, tú sigues siendo mi destino favorito.'
  }
};
