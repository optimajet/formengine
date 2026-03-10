export const bookingDetailsFormMantine = JSON.stringify({
  errorType: 'MtErrorWrapper',
  form: {
    key: 'Screen',
    type: 'Screen',
    children: [
      {
        key: 'step1-container',
        type: 'MtContainer',
        props: {},
        css: {any: {object: {display: 'flex', flexDirection: 'column', gap: '16px'}}},
        children: [
          {
            key: 'check-in-date',
            type: 'MtDatePickerInput',
            props: {label: {value: 'Check-in'}, placeholder: {value: 'Pick a date'}},
            schema: {
              validations: [
                {key: 'required'},
                {
                  key: 'code',
                  args: {
                    code: `
                    if (!value) return true;
                    const today = new Date();
                    today.setDate(today.getDate() + 1);
                    today.setHours(0, 0, 0, 0);
                    const selected = new Date(value);
                    selected.setHours(0, 0, 0, 0);
                    return selected < today;
                  `,
                    message: "Check-in date cannot precede today's date.",
                  },
                },
              ],
            },
          },
          {
            key: 'check-out-date',
            type: 'MtDatePickerInput',
            props: {label: {value: 'Check-out'}, placeholder: {value: 'Pick a date'}},
            schema: {
              validations: [
                {key: 'required'},
                {
                  key: 'code',
                  args: {
                    code: `
                    if (!value) return true;
                    const checkin = new Date(form.data['check-in-date']);
                    checkin.setHours(0, 0, 0, 0);
                    const selected = new Date(value);
                    selected.setHours(0, 0, 0, 0);
                    return selected > checkin;
                  `,
                    message: 'Check-out date cannot precede check-in date.',
                  },
                },
              ],
            },
          },
          {
            key: 'number-of-guests',
            type: 'MtSelect',
            props: {
              label: {value: 'Number of guests'},
              data: {
                value: [
                  {value: '1', label: '1'},
                  {value: '2', label: '2'},
                  {value: '3', label: '3'},
                  {value: '4', label: '4'},
                  {value: '5', label: '5'},
                  {value: '6', label: '6'},
                ],
              },
              value: {value: '2'},
            },
            schema: {validations: [{key: 'required'}]},
          },
          {
            key: 'room-type',
            type: 'MtSelect',
            props: {
              label: {value: 'Room type'},
              data: {
                value: [
                  {value: 'queen', label: 'Queen Room'},
                  {value: 'king', label: 'King Room'},
                  {value: 'deluxe-king', label: 'Deluxe King Room'},
                ],
              },
              value: {value: 'queen'},
            },
            schema: {validations: [{key: 'required'}]},
          },
          {
            key: 'room-preview-image',
            type: 'MtImage',
            props: {
              src: {
                computeType: 'function',
                fnSource:
                  "  const roomType = form.rootData['room-type'];\n  if (roomType === 'king') return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80';\n  if (roomType === 'deluxe-king') return 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80';\n  if (roomType === 'superior-king') return 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80';\n  return 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80';\n",
              },
              alt: {value: 'Room preview'},
            },
            css: {any: {object: {height: '224px'}}},
          },
          {
            key: 'non-smoking',
            type: 'MtCheckbox',
            props: {label: {value: 'Non-smoking'}, checked: {value: false}},
          },
          {
            key: 'notes',
            type: 'MtTextarea',
            props: {label: {value: 'Notes'}, placeholder: {value: 'Additional notes'}, minRows: {value: 3}},
          },
        ],
      },
    ],
  },
})

export const travelerInfoFormMantine = JSON.stringify({
  errorType: 'MtErrorWrapper',
  form: {
    key: 'Screen',
    type: 'Screen',
    children: [
      {
        key: 'step2-container',
        type: 'MtContainer',
        props: {},
        css: {any: {object: {display: 'flex', flexDirection: 'column', gap: '16px'}}},
        children: [
          {
            key: 'last-name',
            type: 'MtTextInput',
            props: {label: {value: 'Last name'}, placeholder: {value: 'Last name'}},
            schema: {validations: [{key: 'required'}]},
          },
          {
            key: 'first-name',
            type: 'MtTextInput',
            props: {label: {value: 'First name'}, placeholder: {value: 'First name'}},
            schema: {validations: [{key: 'required'}]},
          },
          {
            key: 'phone',
            type: 'MtTextInput',
            props: {label: {value: 'Phone'}, placeholder: {value: 'Phone'}},
          },
          {
            key: 'country',
            type: 'MtSelect',
            props: {
              label: {value: 'Country'},
              data: {
                value: [
                  {value: 'United States', label: 'United States'},
                  {value: 'Canada', label: 'Canada'},
                  {value: 'United Kingdom', label: 'United Kingdom'},
                  {value: 'France', label: 'France'},
                  {value: 'Germany', label: 'Germany'},
                  {value: 'Japan', label: 'Japan'},
                ],
              },
            },
          },
        ],
      },
    ],
  },
})
