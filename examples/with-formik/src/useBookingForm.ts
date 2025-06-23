import {useFormik} from 'formik'
import {useMemo, useState} from 'react'
import {FormikProps} from 'formik/dist/types'

export type BookingForm = Partial<{
  fullName: string,
  guestCount: number,
  checkinDate: Date
}>

export type BookingFormErrors = Partial<Record<keyof BookingForm, string>>

export const useBookingForm = (): [FormikProps<BookingForm>, BookingForm] => {
  const [formData, setFormData] = useState<BookingForm>({})

  const initialValues = useMemo<BookingForm>(() => ({
    fullName: '',
    guestCount: 1,
    checkinDate: new Date()
  }), [])

  const formik = useFormik<BookingForm>({
    initialValues,
    // validate: ({checkinDate, fullName, guestCount}) => {
    //   let errors: Partial<Record<keyof typeof initialValues, string>> = {};
    //
    //   if (!fullName) {
    //     errors.fullName = 'Name is required.';
    //   } else if (fullName.trim().split(' ').length < 2) {
    //     errors.fullName = 'Please enter a full name.'
    //   }
    //
    //   if (!checkinDate) {
    //     errors.checkinDate = 'Date is required.';
    //   }
    //
    //   if (!isFinite(guestCount as number) || (guestCount as number) < 1) {
    //     errors.guestCount = 'No guest entered.';
    //   }
    //
    // return errors;
    // },
    onSubmit: (data) => {
      setFormData(data)
      console.log(data)
    }
  })

  return [formik, formData]
}
