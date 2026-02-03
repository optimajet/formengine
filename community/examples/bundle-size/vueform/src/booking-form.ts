import {todayIso, tomorrowIso} from '@react-form-builder/bundle-size-shared/utils'
import type {VueformConfig} from '@vueform/vueform'
import Vueform, {
  CheckboxElement,
  DateElement,
  DatepickerWrapper,
  ElementAddon,
  ElementAddonOptions,
  ElementDescription,
  ElementError,
  ElementInfo,
  ElementLabel,
  ElementLabelFloating,
  ElementLayout,
  ElementLayoutInline,
  ElementLoader,
  ElementMessage,
  ElementRequired,
  ElementText,
  FormErrors,
  FormMessages,
  FormStep,
  FormSteps,
  FormStepsControl,
  FormStepsControls,
  MultiselectElement,
  SelectElement,
  StaticElement,
  TextareaElement,
  TextElement,
  Validator,
} from '@vueform/vueform/src/core.js'
import {computed, createApp, defineComponent, h, ref, resolveComponent} from 'vue'
import '@react-form-builder/bundle-size-shared/index.css'

import {handleSubmit} from './utils.ts'

const App = defineComponent({
  name: 'Booking',
  setup() {
    const formRef = ref()
    const today = todayIso()
    const checkInDateValue = ref(today)
    const roomTypeValue = ref('queen')

    const CheckInDateValidator = class extends Validator {
      get msg() {
        return "Check-in date cannot precede today's date."
      }

      check(value: string) {
        if (!value) return true

        const checkIn = new Date(value)
        checkIn.setHours(0, 0, 0, 0)

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return checkIn >= today
      }
    }

    const CheckOutDateValidator = class extends Validator {
      get msg() {
        return 'Invalid date range: check-out date cannot precede check-in date.'
      }

      check(value: string) {
        if (!value) return true

        const checkOut = new Date(value)
        checkOut.setHours(0, 0, 0, 0)

        if (!checkInDateValue.value) return true
        const checkIn = new Date(checkInDateValue.value)
        checkIn.setHours(0, 0, 0, 0)

        return checkOut > checkIn
      }
    }

    const roomImageUrl = computed(() => {
      if (roomTypeValue.value === 'king') {
        return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
      }
      if (roomTypeValue.value === 'deluxe-king') {
        return 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
      }
      if (roomTypeValue.value === 'superior-king') {
        return 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80'
      }
      return 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
    })

    const roomDescriptionHtml = computed(() => {
      if (roomTypeValue.value === 'king') {
        return '<h4 style="padding-top:16px">King Room</h4><p style="padding-top:8px;font-size:14px;">Our King Room offers spacious luxury with a king-sized bed for a great night\'s sleep. Stay connected with complimentary Wi-Fi, refresh in the private bathroom, and enjoy in-room entertainment with a flat-screen TV. Keep your favorite beverages cool in the mini-fridge, and start your day right with a coffee from the in-room coffee maker. The ideal retreat for your travels.</p>'
      }
      if (roomTypeValue.value === 'deluxe-king') {
        return '<h4 style="padding-top:16px">Deluxe King Room</h4><p style="padding-top:8px;font-size:14px;">Elevate your stay in our Deluxe King Room. Experience ultimate comfort on a luxurious king-sized bed. Enjoy the convenience of complimentary Wi-Fi, a private bathroom, and entertainment on a flat-screen TV. Stay refreshed with a well-stocked mini-fridge and coffee maker. With added space and upscale amenities, this room offers a touch of luxury for a truly special stay.</p>'
      }
      if (roomTypeValue.value === 'superior-king') {
        return '<h4 style="padding-top:16px">Superior King Room</h4><p style="padding-top:8px;font-size:14px;">Indulge in the epitome of luxury in our Superior King Room. Experience ample space and opulence with a king-sized bed. Complimentary Wi-Fi keeps you connected, while the private bathroom and flat-screen TV provide comfort and entertainment. Enjoy the convenience of a well-equipped mini-fridge and coffee maker. This room is the top choice for a superior and memorable stay.</p>'
      }
      return '<h4 style="padding-top:16px">Queen Room</h4><p style="padding-top:8px;font-size:14px;">Experience comfort and convenience in our Queen Room. Unwind on a cozy queen-sized bed, stay connected with complimentary Wi-Fi, and enjoy the convenience of a private bathroom. For your entertainment, there\'s a flat-screen TV. A mini-fridge and coffee maker are at your disposal for added convenience. Your perfect choice for a relaxing stay.</p>'
    })

    const steps = computed(() => ({
      page1: {
        label: 'Booking Details',
        elements: [
          'check-in-date',
          'check-out-date',
          'number-of-guests',
          'room-type',
          'non-smoking',
          'room-preview-image',
          'room-description',
          'number-of-rooms',
          'with-pets',
          'extras',
          'notes',
        ],
      },
      page2: {
        label: 'Traveler Info',
        elements: ['last-name', 'first-name', 'address-line-1', 'address-line-2', 'city', 'zip', 'state', 'country', 'phone'],
      },
    }))

    const bookingSchema = computed(() => ({
      'check-in-date': {
        type: 'date',
        label: 'Check-in',
        default: today,
        rules: [CheckInDateValidator],
        columns: 4,
        update: (value: string) => {
          checkInDateValue.value = value || today
          if (formRef.value?.$vueform) {
            const checkOutField = formRef.value.$vueform.get('check-out-date')
            if (checkOutField) {
              checkOutField.validate()
            }
          }
        },
      },
      'check-out-date': {
        type: 'date',
        label: 'Check-out',
        default: tomorrowIso(),
        rules: [CheckOutDateValidator],
        columns: 4,
      },
      'number-of-guests': {
        type: 'select',
        label: 'Number of guests',
        columns: 2,
        items: [
          {value: '1', label: '1'},
          {value: '2', label: '2'},
          {value: '3', label: '3'},
          {value: '4', label: '4'},
          {value: '5', label: '5'},
          {value: '6', label: '6'},
          {value: '7', label: '7'},
          {value: '8', label: '8'},
          {value: '9', label: '9'},
          {value: '10+', label: '10+'},
        ],
        default: '2',
      },
      'room-type': {
        type: 'select',
        label: 'Room type',
        columns: 4,
        items: [
          {value: 'queen', label: 'Queen Room'},
          {value: 'king', label: 'King Room'},
          {value: 'deluxe-king', label: 'Deluxe King Room'},
          {value: 'superior-king', label: 'Superior King Room'},
        ],
        default: 'queen',
        rules: ['required'],
        onChange: (value: string) => {
          roomTypeValue.value = value || 'queen'
        },
      },
      'room-preview-image': {
        type: 'static',
        columns: 7,
        content: `<img src="${roomImageUrl.value}" alt="Room preview" style="width:100%;height:224px;object-fit:cover;" />`,
      },
      'room-description': {
        type: 'static',
        columns: 5,
        content: roomDescriptionHtml.value,
      },
      'non-smoking': {
        type: 'checkbox',
        text: 'Non-smoking',
        columns: 5,
        default: false,
      },
      'number-of-rooms': {
        type: 'text',
        inputType: 'number',
        label: 'Number of rooms',
        columns: 4,
        min: 1,
        max: 5,
        default: 1,
      },
      'with-pets': {
        columns: 3,
        type: 'checkbox',
        text: 'I am traveling with pets',
        default: false,
      },
      extras: {
        type: 'multiselect',
        label: 'Extras',
        items: [
          {value: 'Breakfast', label: 'Breakfast'},
          {value: 'Fitness', label: 'Fitness'},
          {value: 'Parking', label: 'Parking'},
          {value: 'Swimming pool', label: 'Swimming pool'},
          {value: 'Restaurant', label: 'Restaurant'},
          {value: 'Spa', label: 'Spa'},
        ],
        default: [],
      },
      notes: {
        type: 'textarea',
        label: 'Notes',
        placeholder: 'Notes...',
        default: '',
      },
      'last-name': {
        type: 'text',
        label: 'Last name',
        placeholder: 'Last name',
        description: 'Must match the passport exactly.',
        columns: 6,
        rules: ['required'],
      },
      'first-name': {
        type: 'text',
        label: 'First name',
        placeholder: 'First name',
        rules: ['required'],
        columns: 6,
      },
      'address-line-1': {
        type: 'text',
        label: 'Address line 1',
        placeholder: 'Address line 1',
        columns: 6,
      },
      'address-line-2': {
        type: 'text',
        label: 'Address line 2',
        placeholder: 'Address line 2',
        columns: 6,
      },
      city: {
        type: 'text',
        label: 'City',
        placeholder: 'City',
        columns: 4,
      },
      zip: {
        type: 'text',
        label: 'Zip code',
        placeholder: 'Zip code',
        columns: 4,
      },
      state: {
        type: 'text',
        label: 'State',
        placeholder: 'State',
        columns: 4,
      },
      country: {
        type: 'select',
        label: 'Country',
        placeholder: 'Country',
        items: [
          {value: 'United States', label: 'United States'},
          {value: 'Canada', label: 'Canada'},
          {value: 'United Kingdom', label: 'United Kingdom'},
          {value: 'France', label: 'France'},
          {value: 'Germany', label: 'Germany'},
          {value: 'Japan', label: 'Japan'},
        ],
        columns: 6,
      },
      phone: {
        type: 'text',
        label: 'Phone',
        placeholder: 'Phone',
        description: 'Example: +1 (555) 777-55-22',
        columns: 6,
        rules: ['regex:^\\+?[0-9\\s().-]{7,}$'],
      },
    }))

    return {
      formRef,
      steps,
      bookingSchema,
      handleSubmit,
    }
  },
  render() {
    const VueformComponent = resolveComponent('Vueform')

    return h('div', [
      h(VueformComponent, {
        ref: 'formRef',
        schema: this.bookingSchema,
        steps: this.steps,
        endpoint: false,
        onSubmit: this.handleSubmit,
      }),
    ])
  },
})

export const main = (vueformConfig: VueformConfig) => {
  const app = createApp(App)
  app.use(Vueform, {
    ...vueformConfig,
    components: {
      FormErrors,
      FormMessages,
      FormSteps,
      FormStep,
      FormStepsControls,
      FormStepsControl,
      ElementLayout,
      ElementLayoutInline,
      ElementLoader,
      ElementLabelFloating,
      ElementLabel,
      ElementInfo,
      ElementDescription,
      ElementError,
      ElementRequired,
      ElementMessage,
      ElementText,
      ElementAddon,
      ElementAddonOptions,
      TextElement,
      CheckboxElement,
      DateElement,
      DatepickerWrapper,
      StaticElement,
      MultiselectElement,
      SelectElement,
      TextareaElement,
    },
  })
  app.mount('#app')
}
