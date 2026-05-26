import crypto from 'crypto';
import prisma from '../lib/db';
import { hashPassword } from '../lib/hash';

function uid(seed: string): string {
  return crypto.createHash('sha256').update(seed).digest('hex');
}

async function main() {
  console.log('🌱 Iniciando seed de KnowledgExchange…');

  await prisma.penalties.deleteMany();
  await prisma.messages.deleteMany();
  await prisma.participants.deleteMany();
  await prisma.conversations.deleteMany();
  await prisma.reviews.deleteMany();
  await prisma.exchanges.deleteMany();
  await prisma.activities.deleteMany();
  await prisma.contacts.deleteMany();
  await prisma.users.deleteMany();

  const adminHash = await hashPassword('Admin1234!');
  const userHash = await hashPassword('User1234!');

  const ADMIN = uid('admin@knowledgexchange.dev');
  const ANA = uid('ana.garcia@example.com');
  const CARLOS = uid('carlos.perez@example.com');
  const LUCIA = uid('lucia.martinez@example.com');
  const PABLO = uid('pablo.ruiz@example.com');
  const SOFIA = uid('sofia.lopez@example.com');
  const MIGUEL = uid('miguel.sanchez@example.com');
  const CARMEN = uid('carmen.fernandez@example.com');
  const ROBERTO = uid('roberto.diaz@example.com');

  await prisma.users.createMany({
    data: [
      {
        id_user: ADMIN,
        username: 'admin',
        email: 'admin@knowledgexchange.dev',
        psw_hash: adminHash,
        name: 'Admin',
        surnames: 'Sistema',
        country: 'España',
        born_date: new Date('1990-01-15'),
        role: 'admin',
        description: 'Administrador de la plataforma.',
        location: 'Madrid, España',
      },
      {
        id_user: ANA,
        username: 'ana_garcia',
        email: 'ana.garcia@example.com',
        psw_hash: userHash,
        name: 'Ana',
        surnames: 'García López',
        country: 'España',
        born_date: new Date('1995-03-22'),
        description: 'Profesora de inglés y diseñadora gráfica freelance.',
        location: 'Barcelona, España',
      },
      {
        id_user: CARLOS,
        username: 'carlos_perez',
        email: 'carlos.perez@example.com',
        psw_hash: userHash,
        name: 'Carlos',
        surnames: 'Pérez Ruiz',
        country: 'España',
        born_date: new Date('1988-07-10'),
        description: 'Desarrollador full-stack y fotógrafo de fin de semana.',
        location: 'Valencia, España',
      },
      {
        id_user: LUCIA,
        username: 'lucia_mtz',
        email: 'lucia.martinez@example.com',
        psw_hash: userHash,
        name: 'Lucía',
        surnames: 'Martínez Sanz',
        country: 'España',
        born_date: new Date('2000-11-05'),
        description: 'Estudiante de música, doy clases de guitarra y yoga.',
        location: 'Sevilla, España',
      },
      {
        id_user: PABLO,
        username: 'pablo_ruiz',
        email: 'pablo.ruiz@example.com',
        psw_hash: userHash,
        name: 'Pablo',
        surnames: 'Ruiz Domingo',
        country: 'España',
        born_date: new Date('1992-04-18'),
        description: 'Ingeniero informático. Me apaño bien con reparaciones del hogar.',
        location: 'Madrid, España',
      },
      {
        id_user: SOFIA,
        username: 'sofia_lopez',
        email: 'sofia.lopez@example.com',
        psw_hash: userHash,
        name: 'Sofía',
        surnames: 'López Vega',
        country: 'España',
        born_date: new Date('1996-08-30'),
        description: 'Diseñadora UX y profesora de francés certificada.',
        location: 'Málaga, España',
      },
      {
        id_user: MIGUEL,
        username: 'miguel_chef',
        email: 'miguel.sanchez@example.com',
        psw_hash: userHash,
        name: 'Miguel',
        surnames: 'Sánchez Vidal',
        country: 'España',
        born_date: new Date('1985-02-14'),
        description: 'Cocinero apasionado. Ofrezco talleres de cocina mediterránea y repostería.',
        location: 'Zaragoza, España',
      },
      {
        id_user: CARMEN,
        username: 'carmen_pets',
        email: 'carmen.fernandez@example.com',
        psw_hash: userHash,
        name: 'Carmen',
        surnames: 'Fernández Mora',
        country: 'España',
        born_date: new Date('1989-12-27'),
        description: 'Adiestradora canina e instructora de pilates.',
        location: 'Granada, España',
      },
      {
        id_user: ROBERTO,
        username: 'roberto_keys',
        email: 'roberto.diaz@example.com',
        psw_hash: userHash,
        name: 'Roberto',
        surnames: 'Díaz Herrera',
        country: 'España',
        born_date: new Date('1991-09-03'),
        description: 'Pianista clásico y técnico de reparación de ordenadores.',
        location: 'Valladolid, España',
      },
    ],
  });

  const created = await prisma.activities.createManyAndReturn({
    data: [
      { id_user: ANA, name: 'Clases de inglés conversacional', description: 'Sesiones de 1h para mejorar tu fluidez oral. Nivel B1 en adelante. Material incluido.', topic: 'Idiomas', type: 'online', status: 'active' },
      { id_user: ANA, name: 'Diseño de logotipos', description: 'Diseño profesional de logotipos con archivos vectoriales y manual de marca breve.', topic: 'Arte', type: 'online', status: 'active' },
      { id_user: CARLOS, name: 'Desarrollo web con Next.js', description: 'Te ayudo a montar tu proyecto Next.js desde cero o a resolver problemas concretos.', topic: 'Informática', type: 'online', status: 'active' },
      { id_user: CARLOS, name: 'Sesión de fotografía de retrato', description: 'Sesión de 2h en exterior, incluye 20 fotos retocadas. Trae ropa cómoda.', topic: 'Arte', type: 'presencial', location: 'Valencia, España', status: 'active' },
      { id_user: LUCIA, name: 'Clases de guitarra para principiantes', description: 'Aprende acordes básicos y toca tus primeras canciones en 4 semanas.', topic: 'Música', type: 'presencial', location: 'Sevilla, España', status: 'active' },
      { id_user: LUCIA, name: 'Yoga y meditación', description: 'Sesión de 1h de yoga hatha y 20 minutos de meditación guiada. Todos los niveles.', topic: 'Deporte', type: 'presencial', location: 'Sevilla, España', status: 'active' },
      { id_user: PABLO, name: 'Python desde cero', description: 'Aprende Python con ejemplos prácticos. Sintaxis, listas, funciones y un mini-proyecto.', topic: 'Informática', type: 'online', status: 'active' },
      { id_user: PABLO, name: 'Pequeñas reparaciones del hogar', description: 'Te ayudo a montar muebles, colgar estantes o arreglar grifos. Madrid y alrededores.', topic: 'Hogar', type: 'presencial', location: 'Madrid, España', status: 'active' },
      { id_user: SOFIA, name: 'Conversación en francés A2/B1', description: 'Clases dinámicas centradas en situaciones reales: viajes, trabajo y compras.', topic: 'Idiomas', type: 'online', status: 'active' },
      { id_user: SOFIA, name: 'Diseño UX para apps', description: 'Wireframes y prototipos navegables en Figma. Foco en accesibilidad y usabilidad.', topic: 'Arte', type: 'online', status: 'active' },
      { id_user: MIGUEL, name: 'Taller de cocina mediterránea', description: 'Aprende a cocinar paella, gazpacho y pescado al horno. Ingredientes incluidos.', topic: 'Cocina', type: 'presencial', location: 'Zaragoza, España', status: 'active' },
      { id_user: MIGUEL, name: 'Repostería artesanal', description: 'Bizcochos, magdalenas y tartas caseras sin conservantes. 3 horas de taller.', topic: 'Cocina', type: 'presencial', location: 'Zaragoza, España', status: 'active' },
      { id_user: CARMEN, name: 'Adiestramiento canino básico', description: 'Comandos esenciales y socialización para cachorros y perros adultos.', topic: 'Mascotas', type: 'presencial', location: 'Granada, España', status: 'active' },
      { id_user: CARMEN, name: 'Pilates nivel intermedio', description: 'Clase de pilates mat para mejorar la fuerza del core y la postura.', topic: 'Deporte', type: 'online', status: 'active' },
      { id_user: ROBERTO, name: 'Clases de piano clásico', description: 'Piano para todos los niveles: lectura, técnica y repertorio a elegir.', topic: 'Música', type: 'presencial', location: 'Valladolid, España', status: 'active' },
      { id_user: ROBERTO, name: 'Reparación de ordenadores', description: 'Diagnóstico, limpieza interna y reinstalación de sistema. Servicio a domicilio.', topic: 'Informática', type: 'presencial', location: 'Valladolid, España', status: 'active' },
    ],
  });

  const A = (i: number) => created[i].id_activity;

  await prisma.contacts.createMany({
    data: [
      { id_user: ANA, friend_id_user: CARLOS },
      { id_user: ANA, friend_id_user: LUCIA },
      { id_user: CARLOS, friend_id_user: ANA },
      { id_user: CARLOS, friend_id_user: PABLO },
      { id_user: LUCIA, friend_id_user: ANA },
      { id_user: LUCIA, friend_id_user: CARMEN },
      { id_user: PABLO, friend_id_user: ROBERTO },
      { id_user: SOFIA, friend_id_user: ANA },
      { id_user: SOFIA, friend_id_user: MIGUEL },
      { id_user: MIGUEL, friend_id_user: SOFIA },
      { id_user: ROBERTO, friend_id_user: PABLO },
    ],
  });

  const ex1 = await prisma.exchanges.create({
    data: {
      requester_id_user: ANA, target_id_user: CARLOS,
      requested_activity: A(3), offered_activity: A(1),
      status: 'completed',
      creation_date: new Date('2025-05-02T10:00:00Z'),
    },
  });

  const ex2 = await prisma.exchanges.create({
    data: {
      requester_id_user: LUCIA, target_id_user: ANA,
      requested_activity: A(0), offered_activity: A(4),
      status: 'completed',
      creation_date: new Date('2025-05-05T15:30:00Z'),
    },
  });

  const ex3 = await prisma.exchanges.create({
    data: {
      requester_id_user: ROBERTO, target_id_user: PABLO,
      requested_activity: A(7), offered_activity: A(14),
      status: 'completed',
      creation_date: new Date('2025-05-08T09:00:00Z'),
    },
  });

  await prisma.exchanges.create({
    data: {
      requester_id_user: PABLO, target_id_user: CARLOS,
      requested_activity: A(2), offered_activity: A(6),
      status: 'accepted',
      creation_date: new Date('2025-05-12T11:00:00Z'),
    },
  });

  await prisma.exchanges.create({
    data: {
      requester_id_user: SOFIA, target_id_user: ANA,
      requested_activity: A(1), offered_activity: A(8),
      status: 'pending',
      creation_date: new Date('2025-05-18T16:00:00Z'),
    },
  });

  await prisma.exchanges.create({
    data: {
      requester_id_user: MIGUEL, target_id_user: CARMEN,
      requested_activity: A(13), offered_activity: A(10),
      status: 'pending',
      creation_date: new Date('2025-05-20T12:00:00Z'),
    },
  });

  await prisma.exchanges.create({
    data: {
      requester_id_user: CARMEN, target_id_user: LUCIA,
      requested_activity: A(4), offered_activity: A(12),
      status: 'refused',
      creation_date: new Date('2025-05-09T14:00:00Z'),
    },
  });

  await prisma.reviews.createMany({
    data: [
      {
        written_by: ANA, written_to_user: CARLOS, id_exchange: ex1.id_exchange,
        content: 'Carlos es un fotógrafo excelente, muy profesional y atento. Las fotos quedaron espectaculares. ¡Totalmente recomendable!',
        valoration: 5, is_flagged: false,
        date: new Date('2025-05-15T18:00:00Z'),
      },
      {
        written_by: CARLOS, written_to_user: ANA, id_exchange: ex1.id_exchange,
        content: 'El logo que me diseñó Ana es justo lo que necesitaba. Trabajo limpio, rápido y con muy buena comunicación. Repetiría sin dudarlo.',
        valoration: 5, is_flagged: false,
        date: new Date('2025-05-16T09:30:00Z'),
      },
      {
        written_by: LUCIA, written_to_user: ANA, id_exchange: ex2.id_exchange,
        content: 'Las clases de inglés con Ana son muy dinámicas. He notado mejora real en mi fluidez oral en pocas semanas. Muy puntual y profesional.',
        valoration: 4, is_flagged: false,
        date: new Date('2025-05-19T20:00:00Z'),
      },
      {
        written_by: ANA, written_to_user: LUCIA, id_exchange: ex2.id_exchange,
        content: 'Lucía es una profesora de guitarra con mucha paciencia. En cuatro sesiones ya estaba tocando canciones. ¡Buenísima!',
        valoration: 5, is_flagged: false,
        date: new Date('2025-05-20T10:15:00Z'),
      },
      {
        written_by: ROBERTO, written_to_user: PABLO, id_exchange: ex3.id_exchange,
        content: 'Pésima experiencia. Pablo llegó tarde, no trajo herramientas y encima dejó el desorden por toda la casa. Un completo desastre, no lo recomiendo en absoluto.',
        valoration: 1, is_flagged: true,
        date: new Date('2025-05-22T17:00:00Z'),
      },
      {
        written_by: PABLO, written_to_user: ROBERTO, id_exchange: ex3.id_exchange,
        content: 'Roberto es muy competente con los ordenadores, me dejó el equipo como nuevo. Algo distante en el trato, pero el trabajo bien hecho.',
        valoration: 4, is_flagged: false,
        date: new Date('2025-05-22T19:30:00Z'),
      },
    ],
  });

  console.log('');
  console.log('✅ Datos creados:');
  console.log('   • 9 usuarios (1 admin + 8 usuarios)');
  console.log(`   • ${created.length} actividades`);
  console.log('   • 11 contactos');
  console.log('   • 7 intercambios (3 completados, 1 aceptado, 2 pendientes, 1 rechazado)');
  console.log('   • 6 valoraciones (1 marcada para moderación)');
  console.log('');
  console.log('📋 Credenciales de prueba:');
  console.log('   admin@knowledgexchange.dev  /  Admin1234!  (rol: admin)');
  console.log('   ana.garcia@example.com      /  User1234!');
  console.log('   carlos.perez@example.com    /  User1234!');
  console.log('   lucia.martinez@example.com  /  User1234!');
  console.log('   pablo.ruiz@example.com      /  User1234!');
  console.log('   sofia.lopez@example.com     /  User1234!');
  console.log('   miguel.sanchez@example.com  /  User1234!');
  console.log('   carmen.fernandez@example.com /  User1234!');
  console.log('   roberto.diaz@example.com    /  User1234!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
