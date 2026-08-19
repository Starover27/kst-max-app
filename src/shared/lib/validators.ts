import { z } from 'zod'

export const appointmentSchema = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().min(1),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
})

export type AppointmentFormValues = z.infer<typeof appointmentSchema>
