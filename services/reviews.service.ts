import prisma from '@/lib/db';
import { BadRequestError, NotFoundError, ConflictError, ForbiddenError } from '@/lib/api-error';

const TOXIC_WORDS = [
  'idiota', 'imbécil', 'estúpido', 'estafador', 'estafa', 'mierda', 'basura', 
  'asqueroso', 'inútil', 'patético', 'tonto', 'cretino', 'odio', 'pésimo', 'horrible',
  'puta', 'puto', 'putón', 'gilipollas', 'cabrón', 'cabronazo', 'capullo', 'mamón', 
  'soplapollas', 'soplagaitas', 'joder', 'coño', 'carajo', 'hostia', 'cojones', 
  'putada', 'jodienda', 'chingada', 'pendejo', 'culero', 'boludo', 'pelotudo', 
  'forro', 'sorete', 'tarado', 'pajero', 'weón', 'huevón', 'culiado', 'culiao', 
  'conchetumare', 'chucha', 'pinche', 'baboso', 'gonorrea', 'malparido', 'carechimba', 
  'pajuo', 'mamaguevo', 'hijoputa', 'hijodeputa', 'malnacido', 
  'tontolaba', 'cenutrio', 'zoquete', 'zopenco', 'mendrugo', 'ceporro', 'papanatas', 
  'mentecato', 'lelo', 'lerdo', 'bobo', 'memo', 'simplón', 'descerebrado', 'corto', 
  'cabezaweba', 'merluzo', 'besugo', 'cebollino', 'melón', 'cazurro', 'burro', 
  'asno', 'mula', 'idiotez', 'estupidez', 'imbecilidad', 'gilipollez',
  'canalla', 'sinvergüenza', 'desgraciado', 'miserable', 'ruin', 'mezquino', 
  'rastrero', 'rata', 'víbora', 'hipócrita', 'falso', 'mentiroso', 'embustero', 
  'farsante', 'bastardo', 'arpía', 'bruja', 'lagarta', 'infame', 'abyecto', 'vil',
  'chupóptero', 'chupapollas', 'tocapelotas', 'tocanarices', 'lameculos', 'lamebotas', 
  'arrastrado', 'pagafantas', 'parásito', 'estorbo', 'pesado', 'plasta', 'cansino', 
  'plomo', 'mosca', 'acosador', 'hater', 'troll', 'spammer', 'anormal', 'feo', 
  'fracasado', 'perdedor', 'mediocre', 'pelele', 'mequetrefe', 'mindundi', 'escoria', 
  'repugnante', 'vomitivo', 'indeseable', 'adefesio', 'cardo', 'orco', 'engendro', 
  'parguela', 'pringao', 'pringado', 'tirado', 'zarrapastroso', 'piojoso', 'mugriento', 
  'guarro', 'cerdo', 'cochino', 'marrano', 'asquerosidad', 'podrido', 'apestoso', 
  'hediondo', 'nauseabundo', 'mierdoso', 'mierdecilla',
  'timador', 'timo', 'robo', 'ladrón', 'ratero', 'chorizo', 'mangante', 'chupasangres', 
  'buitre', 'engaño', 'fraude', 'ladrones', 'estafadores',
  'engreído', 'arrogante', 'prepotente', 'fantasma', 'bocazas', 'chulo', 'payaso', 
  'ridículo', 'espantapájaros', 'mamarracho', 'cantamañanas', 'vago', 'holgazán', 
  'perezoso', 'gandul', 'zángano', 'mantenido', 'subnormal',
  'perro', 'perra', 'zorra', 'ramera', 'prostituta', 'fulana', 'guarra', 'cerda', 
  'buscona', 'golfa', 'cornudo', 'cornuda', 'machirulo', 'feminazi', 'retrasado',
  'cabestro', 'bestia', 'energúmeno', 'macarra', 'quinqui', 'choni', 'cani', 
  'poligonero', 'cateto', 'paleto', 'pueblerino', 'ignorante', 'inculto', 'analfabeto',
  'maricon', 'maricón', 'marimacho', 'marimacha', 'mariposa', 'mariposón', 'mariposón',
  'bujarra', 'bollera', 'lesbiana', 'tortillera', 'maricona', 'mariconazo', 'bujarrilla'
];

export interface CreateReviewInput {
  written_by: string;
  id_exchange: number;
  valoration: number;
  content: string;
}

function shouldAutoFlag(content: string, valoration: number): boolean {
  if (valoration <= 2) return true;
  const lower = content.toLowerCase();
  return TOXIC_WORDS.some((w) => lower.includes(w));
}

export async function createReview(data: CreateReviewInput) {
  if (!Number.isInteger(data.valoration) || data.valoration < 1 || data.valoration > 5) {
    throw new BadRequestError('La valoración debe ser un número entero entre 1 y 5.');
  }
  const content = data.content?.trim() ?? '';
  if (content.length < 5 || content.length > 250) {
    throw new BadRequestError('La reseña debe tener entre 5 y 250 caracteres.');
  }

  const exchange = await prisma.exchanges.findUnique({
    where: { id_exchange: data.id_exchange },
    select: {
      id_exchange: true,
      status: true,
      requester_id_user: true,
      target_id_user: true,
    },
  });
  if (!exchange) throw new NotFoundError('Intercambio');

  if (exchange.status !== 'completed') {
    throw new BadRequestError('Solo puedes valorar intercambios completados.');
  }

  const isParticipant =
    exchange.requester_id_user === data.written_by ||
    exchange.target_id_user === data.written_by;
  if (!isParticipant) {
    throw new ForbiddenError('No eres parte de este intercambio.');
  }

  const written_to_user =
    exchange.requester_id_user === data.written_by
      ? exchange.target_id_user
      : exchange.requester_id_user;

  const existing = await prisma.reviews.findUnique({
    where: {
      written_by_id_exchange: {
        written_by: data.written_by,
        id_exchange: data.id_exchange,
      },
    },
  });
  if (existing) {
    throw new ConflictError('Ya has valorado este intercambio.');
  }

  return prisma.reviews.create({
    data: {
      written_by: data.written_by,
      written_to_user,
      id_exchange: data.id_exchange,
      content,
      valoration: data.valoration,
      is_flagged: shouldAutoFlag(content, data.valoration),
    },
    select: {
      id_review: true,
      valoration: true,
      content: true,
      date: true,
      is_flagged: true,
    },
  });
}
