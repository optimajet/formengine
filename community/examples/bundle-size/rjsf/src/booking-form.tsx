import {todayIso, tomorrowIso} from '@react-form-builder/bundle-size-shared/utils'
import type {FormProps, IChangeEvent} from '@rjsf/core'
import type {FormValidation, RJSFSchema, UiSchema, ValidatorType} from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import {type ButtonHTMLAttributes, type ComponentType, useCallback, useMemo, useState} from 'react'

type RoomType = 'queen' | 'king' | 'deluxe-king' | 'superior-king'

export interface BookingFormData {
  rowDatesGuests?: {
    checkInDate: string
    checkOutDate: string
    numberOfGuests?: string
  }
  rowRoomType?: {
    roomType?: RoomType
    nonSmoking?: boolean
  }
  rowRoomPreview?: {
    roomPreviewImage?: string
    roomDescription?: string
  }
  rowRoomsPets?: {
    numberOfRooms?: number
    withPets?: boolean
  }
  rowExtras?: {
    extras?: string[]
  }
  rowNotes?: {
    notes?: string
  }
  checkInDate?: string
  checkOutDate?: string
  numberOfGuests?: string
  roomType?: RoomType
  nonSmoking?: boolean
  numberOfRooms?: number
  withPets?: boolean
  extras?: string[]
  notes?: string
  lastName?: string
  firstName?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  zip?: string
  state?: string
  country?: string
  phone?: string
}

const defaultFormData: BookingFormData = {
  rowDatesGuests: {
    checkInDate: todayIso(),
    checkOutDate: tomorrowIso(),
    numberOfGuests: '2',
  },
  rowRoomType: {
    roomType: 'queen',
    nonSmoking: false,
  },
  rowRoomPreview: {
    roomPreviewImage: '',
    roomDescription: '',
  },
  rowRoomsPets: {
    numberOfRooms: 1,
    withPets: false,
  },
  rowExtras: {
    extras: [],
  },
  rowNotes: {
    notes: '',
  },
}

const bookingSchema: RJSFSchema = {
  type: 'object',
  required: ['rowDatesGuests', 'rowRoomType'],
  properties: {
    rowDatesGuests: {
      type: 'object',
      title: '',
      required: ['checkInDate', 'checkOutDate'],
      properties: {
        checkInDate: {
          type: 'string',
          format: 'date',
          title: 'Check-in',
          description: "Check-in date cannot precede today's date.",
        },
        checkOutDate: {
          type: 'string',
          format: 'date',
          title: 'Check-out',
          description: 'Invalid date range: check-out date cannot precede check-in date.',
        },
        numberOfGuests: {
          type: 'string',
          title: 'Number of guests',
          enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'],
          default: '2',
        },
      },
    },
    rowRoomType: {
      type: 'object',
      title: '',
      required: ['roomType'],
      properties: {
        roomType: {
          type: 'string',
          title: 'Room type',
          oneOf: [
            {const: 'queen', title: 'Queen Room'},
            {const: 'king', title: 'King Room'},
            {const: 'deluxe-king', title: 'Deluxe King Room'},
            {const: 'superior-king', title: 'Superior King Room'},
          ],
        },
        nonSmoking: {
          type: 'boolean',
          title: 'Non-smoking',
          default: false,
        },
      },
    },
    rowRoomPreview: {
      type: 'object',
      title: '',
      properties: {
        roomPreviewImage: {
          type: 'string',
          title: '',
        },
        roomDescription: {
          type: 'string',
          title: '',
        },
      },
    },
    rowRoomsPets: {
      type: 'object',
      title: '',
      properties: {
        numberOfRooms: {
          type: 'integer',
          title: 'Number of rooms',
          minimum: 1,
          maximum: 5,
        },
        withPets: {
          type: 'boolean',
          title: 'I am traveling with pets',
          default: false,
        },
      },
    },
    rowExtras: {
      type: 'object',
      title: '',
      properties: {
        extras: {
          type: 'array',
          title: 'Extras',
          uniqueItems: true,
          items: {
            type: 'string',
            enum: ['Breakfast', 'Fitness', 'Parking', 'Swimming pool', 'Restaurant', 'Spa'],
          },
        },
      },
    },
    rowNotes: {
      type: 'object',
      title: '',
      properties: {
        notes: {
          type: 'string',
          title: 'Notes',
        },
      },
    },
  },
}

const travelerSchema: RJSFSchema = {
  title: 'Traveler info',
  type: 'object',
  required: ['rowContact'],
  properties: {
    rowContact: {
      type: 'object',
      title: '',
      required: ['firstName', 'lastName'],
      properties: {
        lastName: {
          type: 'string',
          title: 'Last name',
          description: 'Must match the passport exactly.',
          minLength: 1,
        },
        firstName: {
          type: 'string',
          title: 'First name',
          minLength: 1,
        },
      },
    },
    rowAddressLine1: {
      type: 'object',
      title: '',
      properties: {
        addressLine1: {
          type: 'string',
          title: 'Address line 1',
        },
        addressLine2: {
          type: 'string',
          title: 'Address line 2',
        },
      },
    },
    rowAddressLine2: {
      type: 'object',
      title: '',
      properties: {
        city: {
          type: 'string',
          title: 'City',
        },
        zip: {
          type: 'string',
          title: 'Zip code',
        },
        state: {
          type: 'string',
          title: 'State',
        },
      },
    },
    rowPhone: {
      type: 'object',
      title: '',
      properties: {
        country: {
          type: 'string',
          title: 'Country',
          oneOf: [
            {const: 'United States', title: 'United States'},
            {const: 'Canada', title: 'Canada'},
            {const: 'United Kingdom', title: 'United Kingdom'},
            {const: 'France', title: 'France'},
            {const: 'Germany', title: 'Germany'},
            {const: 'Japan', title: 'Japan'},
          ],
        },
        phone: {
          type: 'string',
          title: 'Phone',
          description: 'Example: +1 (555) 777-55-22',
          pattern: '^\\+?[0-9\\s().-]{7,}$',
        },
      },
    },
  },
}

const bookingUiSchema: UiSchema<BookingFormData> = {
  'ui:order': ['rowDatesGuests', 'rowRoomType', 'rowRoomPreview', 'rowRoomsPets', 'rowExtras', 'rowNotes'],
  rowDatesGuests: {
    'ui:options': {label: false},
    'ui:classNames': 'rjsf-row',
    checkInDate: {
      'ui:placeholder': 'Check-in',
      'ui:options': {label: false},
    },
    checkOutDate: {
      'ui:placeholder': 'Check-out',
      'ui:options': {label: false},
    },
    numberOfGuests: {
      'ui:placeholder': '# of guests',
      'ui:options': {label: false},
    },
  },
  rowRoomType: {
    'ui:options': {label: false},
    'ui:classNames': 'rjsf-row',
    roomType: {
      'ui:placeholder': 'Room type',
      'ui:options': {label: false},
    },
    nonSmoking: {
      'ui:widget': 'checkbox',
    },
  },
  rowRoomPreview: {
    'ui:options': {label: false},
    'ui:classNames': 'rjsf-row',
    roomPreviewImage: {
      'ui:widget': 'hidden',
    },
    roomDescription: {
      'ui:widget': 'hidden',
    },
  },
  rowRoomsPets: {
    'ui:options': {label: false},
    'ui:classNames': 'rjsf-row',
    numberOfRooms: {
      'ui:placeholder': '# of rooms',
      'ui:options': {label: false},
    },
    withPets: {
      'ui:widget': 'checkbox',
    },
  },
  rowExtras: {
    'ui:options': {label: false},
    extras: {
      'ui:widget': 'select',
      'ui:placeholder': 'Extras',
      'ui:options': {label: false},
    },
  },
  rowNotes: {
    'ui:options': {label: false},
    notes: {
      'ui:widget': 'textarea',
      'ui:placeholder': 'Notes...',
      'ui:options': {label: false, rows: 4},
    },
  },
}

const travelerUiSchema: UiSchema<BookingFormData> = {
  'ui:order': ['rowContact', 'rowAddressLine1', 'rowAddressLine2', 'rowPhone'],
  rowContact: {
    'ui:options': {label: false},
    'ui:classNames': 'rjsf-row',
    lastName: {
      'ui:placeholder': 'Last name',
      'ui:options': {label: false},
    },
    firstName: {
      'ui:placeholder': 'First name',
      'ui:options': {label: false},
    },
  },
  rowAddressLine1: {
    'ui:options': {label: false},
    'ui:classNames': 'rjsf-row',
    addressLine1: {
      'ui:placeholder': 'Address line 1',
      'ui:options': {label: false},
    },
    addressLine2: {
      'ui:placeholder': 'Address line 2',
      'ui:options': {label: false},
    },
  },
  rowAddressLine2: {
    'ui:options': {label: false},
    'ui:classNames': 'rjsf-row',
    city: {
      'ui:placeholder': 'City',
      'ui:options': {label: false},
    },
    zip: {
      'ui:placeholder': 'Zip code',
      'ui:options': {label: false},
    },
    state: {
      'ui:placeholder': 'State',
      'ui:options': {label: false},
    },
  },
  rowPhone: {
    'ui:options': {label: false},
    'ui:classNames': 'rjsf-row',
    country: {
      'ui:placeholder': 'Country',
      'ui:options': {label: false},
    },
    phone: {
      'ui:placeholder': 'Phone',
      'ui:options': {label: false},
    },
  },
}

const customValidate = (formData: BookingFormData | undefined, errors: FormValidation<BookingFormData>) => {
  if (!formData) return errors

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const rowDatesGuests = formData.rowDatesGuests
  const checkIn = rowDatesGuests?.checkInDate ? new Date(rowDatesGuests.checkInDate) : undefined
  const checkOut = rowDatesGuests?.checkOutDate ? new Date(rowDatesGuests.checkOutDate) : undefined

  if (checkIn && checkIn < today) {
    errors.rowDatesGuests?.checkInDate?.addError("Check-in date cannot precede today's date.")
  }

  if (checkIn && checkOut && checkOut < checkIn) {
    errors.rowDatesGuests?.checkOutDate?.addError('Invalid date range: check-out date cannot precede check-in date.')
  }

  return errors
}

interface BookingFormProps {
  formComponent: ComponentType<FormProps<BookingFormData>>
  button: ComponentType<ButtonHTMLAttributes<HTMLButtonElement>>
}

const steps = [
  {schema: bookingSchema, uiSchema: bookingUiSchema, submitText: 'Traveler Info ➝'},
  {schema: travelerSchema, uiSchema: travelerUiSchema, submitText: 'Book Now'},
]

const buttonsStyle = {display: 'flex', gap: 12, marginTop: 16}

const getRoomImageUrl = (roomType: RoomType | undefined): string => {
  if (roomType === 'king') return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
  if (roomType === 'deluxe-king') return 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
  if (roomType === 'superior-king') return 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80'
  return 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
}

const getRoomDescription = (roomType: RoomType | undefined): string => {
  if (roomType === 'king') {
    return '<h4 style="padding-top:16px">King Room</h4><p style="padding-top:8px;font-size:14px;">Our King Room offers spacious luxury with a king-sized bed for a great night\'s sleep. Stay connected with complimentary Wi-Fi, refresh in the private bathroom, and enjoy in-room entertainment with a flat-screen TV. Keep your favorite beverages cool in the mini-fridge, and start your day right with a coffee from the in-room coffee maker. The ideal retreat for your travels.</p>'
  }
  if (roomType === 'deluxe-king') {
    return '<h4 style="padding-top:16px">Deluxe King Room</h4><p style="padding-top:8px;font-size:14px;">Elevate your stay in our Deluxe King Room. Experience ultimate comfort on a luxurious king-sized bed. Enjoy the convenience of complimentary Wi-Fi, a private bathroom, and entertainment on a flat-screen TV. Stay refreshed with a well-stocked mini-fridge and coffee maker. With added space and upscale amenities, this room offers a touch of luxury for a truly special stay.</p>'
  }
  if (roomType === 'superior-king') {
    return '<h4 style="padding-top:16px">Superior King Room</h4><p style="padding-top:8px;font-size:14px;">Indulge in the epitome of luxury in our Superior King Room. Experience ample space and opulence with a king-sized bed. Complimentary Wi-Fi keeps you connected, while the private bathroom and flat-screen TV provide comfort and entertainment. Enjoy the convenience of a well-equipped mini-fridge and coffee maker. This room is the top choice for a superior and memorable stay.</p>'
  }
  return '<h4 style="padding-top:16px">Queen Room</h4><p style="padding-top:8px;font-size:14px;">Experience comfort and convenience in our Queen Room. Unwind on a cozy queen-sized bed, stay connected with complimentary Wi-Fi, and enjoy the convenience of a private bathroom. For your entertainment, there\'s a flat-screen TV. A mini-fridge and coffee maker are at your disposal for added convenience. Your perfect choice for a relaxing stay.</p>'
}

export function App({formComponent: Form, button: Button}: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>(defaultFormData)
  const [stepIndex, setStepIndex] = useState(0)
  const currentStep = steps[stepIndex]
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === steps.length - 1

  const roomType = formData.rowRoomType?.roomType || 'queen'

  const roomPreviewData = useMemo(
    () => ({
      roomPreviewImage: getRoomImageUrl(roomType),
      roomDescription: getRoomDescription(roomType),
    }),
    [roomType]
  )

  const updatedFormData = useMemo(
    () => ({
      ...formData,
      rowRoomPreview: roomPreviewData,
    }),
    [formData, roomPreviewData]
  )

  const handleChange = useCallback((event: IChangeEvent<BookingFormData>) => {
    if (event.formData) {
      const roomType = event.formData.rowRoomType?.roomType || 'queen'
      const updatedData = {
        ...event.formData,
        rowRoomPreview: {
          roomPreviewImage: getRoomImageUrl(roomType),
          roomDescription: getRoomDescription(roomType),
        },
      }
      setFormData(updatedData)
    }
  }, [])

  const handleSubmit = useCallback(
    (event: IChangeEvent<BookingFormData>) => {
      if (event.formData) {
        setFormData(event.formData)
      }
      const isLastStep = stepIndex === steps.length - 1
      if (isLastStep) {
        console.warn('Booking data', event.formData)
        return
      }
      setStepIndex(current => Math.min(current + 1, steps.length - 1))
    },
    [stepIndex]
  )

  const handlePrev = useCallback(() => {
    setStepIndex(current => Math.max(current - 1, 0))
  }, [])

  // Custom FieldTemplate components for specific fields
  interface FieldTemplateProps {
    classNames?: string
    style?: React.CSSProperties
  }

  const RoomPreviewImageTemplate = useMemo(
    () => (props: FieldTemplateProps) => {
      return (
        <div className={props.classNames} style={{...props.style, width: '37%', minWidth: '192px'}}>
          <img
            src={updatedFormData.rowRoomPreview?.roomPreviewImage || ''}
            alt="Room preview"
            style={{width: '100%', height: '224px', objectFit: 'cover'}}
          />
        </div>
      )
    },
    [updatedFormData]
  )

  const RoomDescriptionTemplate = useMemo(
    () => (props: FieldTemplateProps) => {
      return (
        <div className={props.classNames} style={{...props.style, width: '63%', minWidth: '256px'}}>
          <div dangerouslySetInnerHTML={{__html: updatedFormData.rowRoomPreview?.roomDescription || ''}} />
        </div>
      )
    },
    [updatedFormData]
  )

  // Update uiSchema to use custom templates only for specific fields
  const customUiSchema = useMemo(() => {
    if (currentStep.uiSchema) {
      return {
        ...currentStep.uiSchema,
        rowRoomPreview: {
          ...currentStep.uiSchema.rowRoomPreview,
          roomPreviewImage: {
            ...currentStep.uiSchema.rowRoomPreview?.roomPreviewImage,
            'ui:FieldTemplate': RoomPreviewImageTemplate,
          },
          roomDescription: {
            ...currentStep.uiSchema.rowRoomPreview?.roomDescription,
            'ui:FieldTemplate': RoomDescriptionTemplate,
          },
        },
      }
    }
    return currentStep.uiSchema
  }, [currentStep.uiSchema, RoomPreviewImageTemplate, RoomDescriptionTemplate])

  return (
    <Form
      schema={currentStep.schema}
      uiSchema={customUiSchema}
      validator={validator as ValidatorType<BookingFormData>}
      formData={updatedFormData}
      customValidate={customValidate}
      onChange={handleChange}
      onSubmit={handleSubmit}
    >
      <div style={buttonsStyle}>
        {!isFirstStep ? (
          <Button type="button" onClick={handlePrev}>
            Booking Details
          </Button>
        ) : null}
        <Button type="submit">{isLastStep ? 'Book Now' : 'Traveler Info ➝'}</Button>
      </div>
    </Form>
  )
}
