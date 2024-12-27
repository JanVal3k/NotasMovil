import * as Notifications from 'expo-notifications';
import {
  format,
  addDays,
  isAfter,
  isBefore,
  startOfDay,
  isSameDay,
} from 'date-fns';

class NotificacionesService {
  //-----------------------------------------------
  static async programarNotificacionesTarea(tarea) {
    console.log('🔄 Programando tarea:', tarea);
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
  //-----------------------------------------------
  static async crearNotificacionesEnRango(tarea) {
    console.log('🔄 Tarea recibida:', tarea); //-------------------------
    const { Titulo, Fecha, Hora } = tarea;
    const { startDate, endDate } = Fecha;
    const horaNotificacion = Hora?.Tiempo || { hours: 9, minutes: 0 };

    const fechaInicio = new Date(startDate);
    const fechaFin = new Date(endDate);
    const ahora = new Date();

    if (isBefore(fechaFin, startOfDay(ahora))) {
      throw new Error('El rango de fechas ya ha pasado');
    }
    const notificationIds = [];

    let fechaActual = new Date(fechaInicio);
    fechaActual.setHours(horaNotificacion.hours, horaNotificacion.minutes, 0);
    if (isBefore(fechaActual, ahora)) {
      fechaActual.setSeconds(0, 0);
    }
    if (isSameDay(fechaInicio, fechaFin)) {
      if (isBefore(fechaActual, ahora)) {
        throw new Error('La hora seleccionada ya pasó para hoy');
      }

      try {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: '¡Recordatorio de Tarea!',
            body: `${Titulo} - ${format(fechaActual, 'HH:mm')}`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            data: {
              tareaId: tarea.dateKey,
              fecha: fechaActual.toISOString(),
            },
          },
          trigger: {
            date: fechaActual,
            shouldAlertIfSilent: true,
          },
        });

        notificationIds.push({
          id,
          fecha: fechaActual.toISOString(),
        });

        return notificationIds;
      } catch (error) {
        console.error('Error al programar notificación:', error);
        throw new Error('Error al programar la notificación');
      }
    } else {
      if (isBefore(fechaActual, ahora)) {
        fechaActual = addDays(startOfDay(ahora), 1);
        fechaActual.setHours(
          horaNotificacion.hours,
          horaNotificacion.minutes,
          0
        );
      }
      while (!isAfter(fechaActual, fechaFin)) {
        try {
          const id = await Notifications.scheduleNotificationAsync({
            content: {
              title: '¡Recordatorio de Tarea!',
              body: `${Titulo} - ${format(fechaActual, 'dd/MM/yyyy HH:mm')}`,
              sound: true,
              priority: Notifications.AndroidNotificationPriority.HIGH,
              data: {
                tareaId: tarea.dateKey,
                fecha: fechaActual.toISOString(),
              },
            },
            trigger: {
              date: fechaActual,
              shouldAlertIfSilent: true,
            },
          });

          notificationIds.push({
            id,
            fecha: fechaActual.toISOString(),
          });

          fechaActual = addDays(fechaActual, 1);
        } catch (error) {
          console.error('Error en notificación específica:', error);
        }
      }
    }

    return notificationIds;
  }
  //-----------------------------------------------
  static async cancelarNotificaciones(notificationIds) {
    try {
      for (const { id } of notificationIds) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }
      return true;
    } catch (error) {
      console.error('Error al cancelar notificaciones:', error);
      return false;
    }
  }
}

export default NotificacionesService;
