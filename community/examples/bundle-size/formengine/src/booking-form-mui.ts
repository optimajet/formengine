export const bookingDetailsForm = JSON.stringify({
  errorType: 'MuiErrorWrapper',
  form: {
    key: 'Screen',
    type: 'Screen',
    children: [
      {
        key: 'step1-container',
        type: 'MuiContainer',
        props: {},
        css: {any: {object: {display: 'flex', flexDirection: 'column', gap: '16px'}}},
        children: [
          {
            key: 'row-dates-guests',
            type: 'MuiContainer',
            props: {},
            css: {any: {object: {flexDirection: 'row', gap: '16px', display: 'flex'}}},
            children: [
              {
                key: 'col-check-in',
                type: 'MuiContainer',
                props: {},
                css: {any: {object: {padding: 0, margin: 0, width: '37%', minWidth: '256px'}}},
                children: [
                  {
                    key: 'check-in-date',
                    type: 'MuiTextField',
                    props: {label: {value: 'Check-in'}, type: {value: 'date'}},
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
                ],
              },
              {
                key: 'col-check-out',
                type: 'MuiContainer',
                props: {},
                css: {any: {object: {padding: 0, margin: 0, width: '37%', minWidth: '256px'}}},
                children: [
                  {
                    key: 'check-out-date',
                    type: 'MuiTextField',
                    props: {label: {value: 'Check-out'}, type: {value: 'date'}},
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
                    
                          console.log(selected, checkin, selected <= checkin);
                            
                          return selected > checkin;
                  `,
                            message: 'Check-out date cannot precede check-in date.',
                          },
                        },
                      ],
                    },
                  },
                ],
              },
              {
                key: 'col-guests',
                type: 'MuiContainer',
                props: {},
                css: {any: {object: {padding: 0, margin: 0, width: '15%', minWidth: '192px'}}},
                children: [
                  {
                    key: 'number-of-guests',
                    type: 'MuiSelect',
                    props: {
                      label: {value: 'Number of guests'},
                      items: {
                        value: [
                          {value: '1', label: '1'},
                          {value: '2', label: '2'},
                          {value: '3', label: '3'},
                          {
                            value: '4',
                            label: '4',
                          },
                          {value: '5', label: '5'},
                          {value: '6', label: '6'},
                          {value: '7', label: '7'},
                          {
                            value: '8',
                            label: '8',
                          },
                          {value: '9', label: '9'},
                          {value: '10+', label: '10+'},
                        ],
                      },
                      value: {value: '2'},
                    },
                  },
                ],
              },
            ],
          },
          {
            key: 'row-room-type',
            type: 'MuiContainer',
            props: {},
            css: {any: {object: {flexDirection: 'row', gap: '16px', display: 'flex'}}},
            children: [
              {
                key: 'col-room-type',
                type: 'MuiContainer',
                props: {},
                css: {any: {object: {padding: 0, margin: 0, width: '74%', minWidth: '256px'}}},
                children: [
                  {
                    key: 'room-type',
                    type: 'MuiSelect',
                    props: {
                      label: {value: 'Room type'},
                      items: {
                        value: [
                          {value: 'queen', label: 'Queen Room'},
                          {
                            value: 'king',
                            label: 'King Room',
                          },
                          {value: 'deluxe-king', label: 'Deluxe King Room'},
                          {value: 'superior-king', label: 'Superior King Room'},
                        ],
                      },
                      value: {value: 'queen'},
                    },
                    schema: {validations: [{key: 'required'}]},
                  },
                ],
              },
              {
                key: 'col-non-smoking',
                type: 'MuiContainer',
                props: {},
                css: {
                  any: {
                    object: {
                      padding: 0,
                      margin: 0,
                      width: '26%',
                      minWidth: '192px',
                      justifyContent: 'flex-end',
                    },
                  },
                },
                children: [
                  {
                    key: 'non-smoking',
                    type: 'MuiCheckbox',
                    props: {label: {value: 'Non-smoking'}, checked: {value: false}},
                  },
                ],
              },
            ],
          },
          {
            key: 'row-room-preview',
            type: 'MuiContainer',
            props: {},
            css: {any: {object: {flexDirection: 'row', gap: '16px', display: 'flex'}}},
            children: [
              {
                key: 'col-room-preview',
                type: 'MuiContainer',
                props: {},
                css: {any: {object: {padding: 0, margin: 0, width: '37%', minWidth: '192px'}}},
                children: [
                  {
                    key: 'room-preview-image',
                    type: 'MuiImage',
                    props: {
                      src: {
                        computeType: 'function',
                        fnSource:
                          "  const roomType = form.rootData['room-type'];\n  if (roomType === 'king') return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80';\n  if (roomType === 'deluxe-king') return 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80';\n  if (roomType === 'superior-king') return 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80';\n  return 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80';\n",
                      },
                    },
                    css: {any: {object: {height: '224px'}}},
                  },
                ],
              },
              {
                key: 'col-room-description',
                type: 'MuiContainer',
                props: {},
                css: {any: {object: {padding: 0, margin: 0, width: '63%', minWidth: '256px'}}},
                children: [
                  {
                    key: 'room-description',
                    type: 'MuiStaticHtml',
                    props: {
                      content: {
                        computeType: 'function',
                        fnSource:
                          "  const roomType = form.rootData['room-type'];\n  if (roomType === 'king') return '<h4 style=\"padding-top:16px\">King Room</h4>\\n<p style=\"padding-top:8px;font-size:14px;\">\\nOur King Room offers spacious luxury with a king-sized bed for a great night\\'s sleep. Stay connected with complimentary Wi-Fi, refresh in the private bathroom, and enjoy in-room entertainment with a flat-screen TV. Keep your favorite beverages cool in the mini-fridge, and start your day right with a coffee from the in-room coffee maker. The ideal retreat for your travels.\\n</p>\\n\\n';\n  if (roomType === 'deluxe-king') return '<h4 style=\"padding-top:16px\">Deluxe King Room</h4>\\n<p style=\"padding-top:8px;font-size:14px;\">\\nElevate your stay in our Deluxe King Room. Experience ultimate comfort on a luxurious king-sized bed. Enjoy the convenience of complimentary Wi-Fi, a private bathroom, and entertainment on a flat-screen TV. Stay refreshed with a well-stocked mini-fridge and coffee maker. With added space and upscale amenities, this room offers a touch of luxury for a truly special stay.\\n</p>\\n\\n';\n  if (roomType === 'superior-king') return '<h4 style=\"padding-top:16px\">Superior King Room</h4>\\n<p style=\"padding-top:8px;font-size:14px;\">\\nIndulge in the epitome of luxury in our Superior King Room. Experience ample space and opulence with a king-sized bed. Complimentary Wi-Fi keeps you connected, while the private bathroom and flat-screen TV provide comfort and entertainment. Enjoy the convenience of a well-equipped mini-fridge and coffee maker. This room is the top choice for a superior and memorable stay.\\n</p>\\n\\n';\n  return '<h4 style=\"padding-top:16px\">Queen Room</h4>\\n<p style=\"padding-top:8px;font-size:14px;\">\\nExperience comfort and convenience in our Queen Room. Unwind on a cozy queen-sized bed, stay connected with complimentary Wi-Fi, and enjoy the convenience of a private bathroom. For your entertainment, there\\'s a flat-screen TV. A mini-fridge and coffee maker are at your disposal for added convenience. Your perfect choice for a relaxing stay.\\n</p>\\n\\n';\n",
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            key: 'row-rooms-pets',
            type: 'MuiContainer',
            props: {},
            css: {any: {object: {flexDirection: 'row', gap: '16px', display: 'flex'}}},
            children: [
              {
                key: 'col-number-of-rooms',
                type: 'MuiContainer',
                props: {},
                css: {any: {object: {padding: 0, margin: 0, width: '50%', minWidth: '192px'}}},
                children: [
                  {
                    key: 'number-of-rooms',
                    type: 'MuiSelect',
                    props: {
                      label: {value: 'Number of rooms'},
                      items: {
                        value: [
                          {value: '1', label: '1'},
                          {value: '2', label: '2'},
                          {value: '3', label: '3'},
                          {
                            value: '4',
                            label: '4',
                          },
                          {value: '5', label: '5'},
                        ],
                      },
                      value: {value: '1'},
                    },
                  },
                ],
              },
              {
                key: 'col-with-pets',
                type: 'MuiContainer',
                props: {},
                css: {
                  any: {
                    object: {
                      padding: 0,
                      margin: 0,
                      width: '40%',
                      minWidth: '256px',
                      justifyContent: 'flex-end',
                    },
                  },
                },
                children: [
                  {
                    key: 'with-pets',
                    type: 'MuiCheckbox',
                    props: {label: {value: 'I am traveling with pets'}, checked: {value: false}},
                  },
                ],
              },
            ],
          },
          {
            key: 'row-extras',
            type: 'MuiContainer',
            props: {},
            css: {any: {object: {flexDirection: 'row', gap: '16px'}}},
            children: [
              {
                key: 'col-extras',
                type: 'MuiContainer',
                props: {},
                css: {any: {object: {padding: 0, margin: 0, width: '100%', minWidth: '256px'}}},
                children: [
                  {
                    key: 'extras',
                    type: 'MuiSelect',
                    props: {
                      label: {value: 'Extras'},
                      items: {
                        value: [
                          {value: 'Breakfast', label: 'Breakfast'},
                          {
                            value: 'Fitness',
                            label: 'Fitness',
                          },
                          {value: 'Parking', label: 'Parking'},
                          {value: 'Swimming pool', label: 'Swimming pool'},
                          {
                            value: 'Restaurant',
                            label: 'Restaurant',
                          },
                          {value: 'Spa', label: 'Spa'},
                        ],
                      },
                      value: {value: ''},
                    },
                  },
                ],
              },
            ],
          },
          {
            key: 'row-notes',
            type: 'MuiContainer',
            props: {},
            css: {any: {object: {flexDirection: 'row'}}},
            children: [
              {
                key: 'col-notes',
                type: 'MuiContainer',
                props: {},
                css: {any: {object: {padding: 0, margin: 0, width: '100%', minWidth: '256px'}}},
                children: [
                  {
                    key: 'notes',
                    type: 'MuiTextField',
                    props: {label: {value: 'Notes'}, multiline: {value: true}, minRows: {value: 3}, value: {value: ''}},
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
})

export const travelerInfoForm = JSON.stringify({
  errorType: 'MuiErrorWrapper',
  form: {
    key: 'Screen',
    type: 'Screen',
    children: [
      {
        key: 'step2-container',
        type: 'MuiContainer',
        props: {},
        css: {any: {object: {display: 'flex', flexDirection: 'column', gap: '16px'}}},
        children: [
          {
            key: 'row-name',
            type: 'MuiContainer',
            props: {},
            css: {any: {object: {flexDirection: 'row', gap: '16px', display: 'flex'}}},
            children: [
              {
                key: 'col-last-name',
                type: 'MuiContainer',
                props: {},
                css: {any: {object: {padding: 0, margin: 0, width: '64%', minWidth: '192px'}}},
                children: [
                  {
                    key: 'last-name',
                    type: 'MuiTextField',
                    props: {label: {value: 'Last name'}, placeholder: {value: 'Last name'}},
                    schema: {validations: [{key: 'required'}]},
                  },
                ],
              },
              {
                key: 'col-first-name',
                type: 'MuiContainer',
                props: {},
                css: {any: {object: {padding: 0, margin: 0, width: '36%', minWidth: '256px'}}},
                children: [
                  {
                    key: 'first-name',
                    type: 'MuiTextField',
                    props: {label: {value: 'First name'}, placeholder: {value: 'First name'}},
                    schema: {validations: [{key: 'required'}]},
                  },
                ],
              },
            ],
          },
          {
            key: 'row-address-line-1',
            type: 'MuiContainer',
            props: {},
            css: {any: {object: {flexDirection: 'row', gap: '16px', display: 'flex'}}},
            children: [
              {
                key: 'col-address-line-1',
                type: 'MuiContainer',
                props: {},
                css: {any: {object: {padding: 0, margin: 0, width: '100%', minWidth: '256px'}}},
                children: [
                  {
                    key: 'address-line-1',
                    type: 'MuiTextField',
                    props: {label: {value: 'Address line 1'}, placeholder: {value: 'Address line 1'}},
                  },
                ],
              },
            ],
          },
          {
            key: 'row-address-line-2',
            type: 'MuiContainer',
            props: {},
            css: {any: {object: {flexDirection: 'row'}}},
            children: [
              {
                key: 'col-address-line-2',
                type: 'MuiContainer',
                props: {},
                css: {any: {object: {padding: 0, margin: 0, width: '100%', minWidth: '256px'}}},
                children: [
                  {
                    key: 'address-line-2',
                    type: 'MuiTextField',
                    props: {label: {value: 'Address line 2'}, placeholder: {value: 'Address line 2'}},
                  },
                ],
              },
            ],
          },
          {
            key: 'row-city-zip-state',
            type: 'MuiContainer',
            props: {},
            css: {any: {object: {flexDirection: 'row', gap: '16px', display: 'flex'}}},
            children: [
              {
                key: 'col-city',
                type: 'MuiContainer',
                props: {},
                css: {any: {object: {padding: 0, margin: 0, width: '36%', minWidth: '256px'}}},
                children: [{key: 'city', type: 'MuiTextField', props: {label: {value: 'City'}, placeholder: {value: 'City'}}}],
              },
              {
                key: 'col-zip',
                type: 'MuiContainer',
                props: {},
                css: {any: {object: {padding: 0, margin: 0, width: '28%', minWidth: '192px'}}},
                children: [
                  {
                    key: 'zip',
                    type: 'MuiTextField',
                    props: {label: {value: 'Zip code'}, placeholder: {value: 'Zip code'}},
                  },
                ],
              },
              {
                key: 'col-state',
                type: 'MuiContainer',
                props: {},
                css: {any: {object: {padding: 0, margin: 0, width: '36%', minWidth: '256px'}}},
                children: [{key: 'state', type: 'MuiTextField', props: {label: {value: 'State'}, placeholder: {value: 'State'}}}],
              },
            ],
          },
          {
            key: 'row-country-phone',
            type: 'MuiContainer',
            props: {},
            css: {any: {object: {flexDirection: 'row', gap: '16px', display: 'flex'}}},
            children: [
              {
                key: 'col-country',
                type: 'MuiContainer',
                props: {},
                css: {any: {object: {padding: 0, margin: 0, width: '36%', minWidth: '256px'}}},
                children: [
                  {
                    key: 'country',
                    type: 'MuiSelect',
                    props: {
                      label: {value: 'Country'},
                      items: {
                        value: [
                          {value: 'United States', label: 'United States'},
                          {
                            value: 'Canada',
                            label: 'Canada',
                          },
                          {value: 'United Kingdom', label: 'United Kingdom'},
                          {value: 'France', label: 'France'},
                          {
                            value: 'Germany',
                            label: 'Germany',
                          },
                          {value: 'Japan', label: 'Japan'},
                        ],
                      },
                    },
                  },
                ],
              },
              {
                key: 'col-phone',
                type: 'MuiContainer',
                props: {},
                css: {any: {object: {flexDirection: 'column', width: '64%', minWidth: '192px'}}},
                children: [{key: 'phone', type: 'MuiTextField', props: {label: {value: 'Phone'}, placeholder: {value: 'Phone'}}}],
              },
            ],
          },
        ],
      },
    ],
  },
})
