import * as Notifications from 'expo-notifications';
import {
  format,
  addDays,
  isAfter,
  isBefore,
  startOfDay,
  isSameDay,
  addMinutes,
} from 'date-fns';

class NotificacionesService {
  static async programarNotificacionesTarea(tarea) {
    try {
      const notificationIds = await this.crearNotificacionesEnRango(tarea);
      return {
        success: true,
        notificationIds,
        message: 'Notificaciones programadas correctamente',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al programar notificaciones',
      };
    }
  }

  static async crearNotificacionesEnRango(tarea) {
    const { Titulo, Fecha, Hora } = tarea;
    const horaNotificacion = Hora?.Tiempo || { hours: 9, minutes: 0 };

    // Crear fechas objetivo correctamente
    const fechaObjetivo = new Date(Fecha.startDate);

    // Configurar la hora específica
    fechaObjetivo.setHours(horaNotificacion.hours);
    fechaObjetivo.setMinutes(horaNotificacion.minutes);
    fechaObjetivo.setSeconds(0);
    fechaObjetivo.setMilliseconds(0);

    // Obtener fecha actual real
    const fechaActual = new Date();

    console.log('DEBUG - Información detallada:');
    console.log('Fecha actual:', {
      completa: fechaActual.toISOString(),
      año: fechaActual.getFullYear(),
      timestamp: fechaActual.getTime(),
    });
    console.log('Fecha objetivo:', {
      completa: fechaObjetivo.toISOString(),
      año: fechaObjetivo.getFullYear(),
      timestamp: fechaObjetivo.getTime(),
    });

    const diferenciaMilisegundos =
      fechaObjetivo.getTime() - fechaActual.getTime();
    const diferenciaMinutos = Math.floor(diferenciaMilisegundos / (1000 * 60));

    console.log('Diferencia real:', {
      milisegundos: diferenciaMilisegundos,
      minutos: diferenciaMinutos,
    });

    if (diferenciaMilisegundos <= 0) {
      throw new Error('La hora configurada para la notificación ya pasó');
    }

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: '¡Recordatorio de Tarea!',
          body: `${Titulo} - Programado para: ${fechaObjetivo.toLocaleTimeString()}`,
          data: {
            tareaId: tarea.dateKey,
            fechaProgramada: fechaObjetivo.toISOString(),
          },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          seconds: Math.floor(diferenciaMilisegundos / 1000),
          repeats: false,
        },
      });

      const notificacionesProgramadas =
        await Notifications.getAllScheduledNotificationsAsync();
      console.log(
        'Notificaciones actualmente programadas:',
        notificacionesProgramadas.map((n) => ({
          id: n.identifier,
          trigger: n.trigger,
          body: n.content.body,
        }))
      );

      return [
        {
          id,
          fecha: fechaObjetivo.toISOString(),
        },
      ];
    } catch (error) {
      console.error('Error al programar notificación:', error);
      throw error;
    }
  }

  static async cancelarTodasLasNotificaciones() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Todas las notificaciones canceladas');
  }
}
export default NotificacionesService;
