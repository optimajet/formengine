import {buildForm} from '@react-form-builder/core'
import {todayDate, todayIso, tomorrowIso} from '@react-form-builder/bundle-size-shared/utils'

export const bookingForm = buildForm({errorType: 'RsErrorMessage'})
  .component('wizard', 'RsWizard')
  .prop('prevButtonLabel', 'Booking Details')
  .prop('nextButtonLabel', 'Traveler Info ➝')
  .prop('finishButtonLabel', 'Book Now')
  .prop('validateOnNext', true)
  .prop('validateOnFinish', true)
  .children(builder =>
    builder
      .component('step1', 'RsWizardStep')
      .prop('label', 'Booking Details')
      .children(stepBuilder =>
        stepBuilder
          .component('step1-container', 'RsContainer')
          .style({flexDirection: 'column', gap: '16px'})
          .children(line =>
            line
              // Row 1: Check-in, Check-out, Guests
              .component('row-dates-guests', 'RsContainer')
              .style({flexDirection: 'row', gap: '16px'})
              .children(row =>
                row
                  .component('col-check-in', 'RsContainer')
                  .style({flexDirection: 'column', width: '37%', minWidth: '256px'})
                  .children(col =>
                    col
                      .component('check-in-date', 'RsDatePicker')
                      .prop('label', 'Check-in')
                      .prop('placeholder', 'Check-in')
                      .prop('oneTap', true)
                      .prop('value', todayIso())
                      .validation('required')
                      .validation('min')
                      .args({value: todayDate(), message: "Check-in date cannot precede today's date."})
                  )

                  .component('col-check-out', 'RsContainer')
                  .style({flexDirection: 'column', width: '37%', minWidth: '256px'})
                  .children(col =>
                    col
                      .component('check-out-date', 'RsDatePicker')
                      .prop('label', 'Check-out')
                      .prop('placeholder', 'Check-out')
                      .prop('oneTap', true)
                      .prop('value', tomorrowIso())
                      .validation('required')
                  )

                  .component('col-guests', 'RsContainer')
                  .style({flexDirection: 'column', width: '15%', minWidth: '192px'})
                  .children(col =>
                    col
                      .component('number-of-guests', 'RsDropdown')
                      .prop('label', 'Number of guests')
                      .prop('placeholder', '# of guests')
                      .prop('data', [
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
                      ])
                      .prop('cleanable', false)
                      .prop('value', '2')
                  )
              )

              // Row 2: Room type and Non-smoking
              .component('row-room-type', 'RsContainer')
              .style({flexDirection: 'row', gap: '16px'})
              .children(row =>
                row
                  .component('col-room-type', 'RsContainer')
                  .style({flexDirection: 'column', width: '74%', minWidth: '256px'})
                  .children(col =>
                    col
                      .component('room-type', 'RsDropdown')
                      .prop('label', 'Room type')
                      .prop('placeholder', 'Room type')
                      .prop('data', [
                        {value: 'queen', label: 'Queen Room'},
                        {value: 'king', label: 'King Room'},
                        {value: 'deluxe-king', label: 'Deluxe King Room'},
                        {value: 'superior-king', label: 'Superior King Room'},
                      ])
                      .prop('cleanable', false)
                      .prop('value', 'queen')
                      .validation('required')
                  )

                  .component('col-non-smoking', 'RsContainer')
                  .style({flexDirection: 'column', width: '26%', minWidth: '192px', justifyContent: 'flex-end'})
                  .children(col => col.component('non-smoking', 'RsCheckbox').prop('children', 'Non-smoking').prop('checked', false))
              )

              // Row 3: Room preview image and description
              .component('row-room-preview', 'RsContainer')
              .style({flexDirection: 'row', gap: '16px'})
              .children(row =>
                row
                  .component('col-room-preview', 'RsContainer')
                  .style({flexDirection: 'column', width: '37%', minWidth: '192px'})
                  .children(col =>
                    col
                      .component('room-preview-image', 'RsImage')
                      .prop('alt', 'Room preview')
                      .style({height: '224px', objectFit: 'cover'})
                      .computedProp(
                        'src',
                        "  const roomType = form.rootData['room-type'];\n" +
                          "  if (roomType === 'king') return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80';\n" +
                          "  if (roomType === 'deluxe-king') return 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80';\n" +
                          "  if (roomType === 'superior-king') return 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80';\n" +
                          "  return 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80';\n"
                      )
                  )

                  .component('col-room-description', 'RsContainer')
                  .style({flexDirection: 'column', width: '63%', minWidth: '256px'})
                  .children(col =>
                    col
                      .component('room-description', 'RsStaticContent')
                      .prop('allowHtml', true)
                      .computedProp(
                        'content',
                        "  const roomType = form.rootData['room-type'];\n" +
                          "  if (roomType === 'king') return '<h4 style=\"padding-top:16px\">King Room</h4>\\n<p style=\"padding-top:8px;font-size:14px;\">\\nOur King Room offers spacious luxury with a king-sized bed for a great night\\'s sleep. Stay connected with complimentary Wi-Fi, refresh in the private bathroom, and enjoy in-room entertainment with a flat-screen TV. Keep your favorite beverages cool in the mini-fridge, and start your day right with a coffee from the in-room coffee maker. The ideal retreat for your travels.\\n</p>\\n\\n';\n" +
                          '  if (roomType === \'deluxe-king\') return \'<h4 style="padding-top:16px">Deluxe King Room</h4>\\n<p style="padding-top:8px;font-size:14px;">\\nElevate your stay in our Deluxe King Room. Experience ultimate comfort on a luxurious king-sized bed. Enjoy the convenience of complimentary Wi-Fi, a private bathroom, and entertainment on a flat-screen TV. Stay refreshed with a well-stocked mini-fridge and coffee maker. With added space and upscale amenities, this room offers a touch of luxury for a truly special stay.\\n</p>\\n\\n\';\n' +
                          '  if (roomType === \'superior-king\') return \'<h4 style="padding-top:16px">Superior King Room</h4>\\n<p style="padding-top:8px;font-size:14px;">\\nIndulge in the epitome of luxury in our Superior King Room. Experience ample space and opulence with a king-sized bed. Complimentary Wi-Fi keeps you connected, while the private bathroom and flat-screen TV provide comfort and entertainment. Enjoy the convenience of a well-equipped mini-fridge and coffee maker. This room is the top choice for a superior and memorable stay.\\n</p>\\n\\n\';\n' +
                          '  return \'<h4 style="padding-top:16px">Queen Room</h4>\\n<p style="padding-top:8px;font-size:14px;">\\nExperience comfort and convenience in our Queen Room. Unwind on a cozy queen-sized bed, stay connected with complimentary Wi-Fi, and enjoy the convenience of a private bathroom. For your entertainment, there\\\'s a flat-screen TV. A mini-fridge and coffee maker are at your disposal for added convenience. Your perfect choice for a relaxing stay.\\n</p>\\n\\n\';\n'
                      )
                  )
              )

              // Row 4: Number of rooms and With pets
              .component('row-rooms-pets', 'RsContainer')
              .style({flexDirection: 'row', gap: '16px'})
              .children(row =>
                row
                  .component('col-number-of-rooms', 'RsContainer')
                  .style({flexDirection: 'column', width: '37%', minWidth: '192px'})
                  .children(col =>
                    col
                      .component('number-of-rooms', 'RsDropdown')
                      .prop('label', 'Number of rooms')
                      .prop('placeholder', '# of rooms')
                      .prop('data', [
                        {value: '1', label: '1'},
                        {value: '2', label: '2'},
                        {value: '3', label: '3'},
                        {value: '4', label: '4'},
                        {value: '5', label: '5'},
                      ])
                      .prop('cleanable', false)
                      .prop('value', '1')
                  )

                  .component('col-with-pets', 'RsContainer')
                  .style({flexDirection: 'column', width: '63%', minWidth: '256px', justifyContent: 'flex-end'})
                  .children(col =>
                    col.component('with-pets', 'RsCheckbox').prop('children', 'I am traveling with pets').prop('checked', false)
                  )
              )

              // Row 5: Extras
              .component('row-extras', 'RsContainer')
              .style({flexDirection: 'row', gap: '16px'})
              .children(row =>
                row
                  .component('col-extras', 'RsContainer')
                  .style({flexDirection: 'column', width: '100%', minWidth: '256px'})
                  .children(col =>
                    col
                      .component('extras', 'RsTagPicker')
                      .prop('label', 'Extras')
                      .prop('placeholder', 'Extras')
                      .prop('data', [
                        {value: 'Breakfast', label: 'Breakfast'},
                        {value: 'Fitness', label: 'Fitness'},
                        {value: 'Parking', label: 'Parking'},
                        {value: 'Swimming pool', label: 'Swimming pool'},
                        {value: 'Restaurant', label: 'Restaurant'},
                        {value: 'Spa', label: 'Spa'},
                      ])
                      .prop('value', [])
                  )
              )

              // Row 6: Notes
              .component('row-notes', 'RsContainer')
              .style({flexDirection: 'row'})
              .children(row =>
                row
                  .component('col-notes', 'RsContainer')
                  .style({flexDirection: 'column', width: '100%', minWidth: '256px'})
                  .children(col =>
                    col.component('notes', 'RsTextArea').prop('label', 'Notes').prop('placeholder', 'Notes...').prop('value', '')
                  )
              )
          )
      )

      .component('step2', 'RsWizardStep')
      .prop('label', 'Traveler Info')
      .children(stepBuilder =>
        stepBuilder
          .component('step2-container', 'RsContainer')
          .style({flexDirection: 'column', gap: '16px'})
          .children(line =>
            line
              // Row 1: Last name and First name
              .component('row-name', 'RsContainer')
              .style({flexDirection: 'row', gap: '16px'})
              .children(row =>
                row
                  .component('col-last-name', 'RsContainer')
                  .style({flexDirection: 'column', width: '64%', minWidth: '192px'})
                  .children(col =>
                    col.component('last-name', 'RsInput').prop('label', 'Last name').prop('placeholder', 'Last name').validation('required')
                  )

                  .component('col-first-name', 'RsContainer')
                  .style({flexDirection: 'column', width: '36%', minWidth: '256px'})
                  .children(col =>
                    col
                      .component('first-name', 'RsInput')
                      .prop('label', 'First name')
                      .prop('placeholder', 'First name')
                      .validation('required')
                  )
              )

              // Row 2: Address line 1
              .component('row-address-line-1', 'RsContainer')
              .style({flexDirection: 'row'})
              .children(row =>
                row
                  .component('col-address-line-1', 'RsContainer')
                  .style({flexDirection: 'column', width: '100%', minWidth: '256px'})
                  .children(col =>
                    col.component('address-line-1', 'RsInput').prop('label', 'Address line 1').prop('placeholder', 'Address line 1')
                  )
              )

              // Row 3: Address line 2
              .component('row-address-line-2', 'RsContainer')
              .style({flexDirection: 'row'})
              .children(row =>
                row
                  .component('col-address-line-2', 'RsContainer')
                  .style({flexDirection: 'column', width: '100%', minWidth: '256px'})
                  .children(col =>
                    col.component('address-line-2', 'RsInput').prop('label', 'Address line 2').prop('placeholder', 'Address line 2')
                  )
              )

              // Row 4: City, Zip, State
              .component('row-city-zip-state', 'RsContainer')
              .style({flexDirection: 'row', gap: '16px'})
              .children(row =>
                row
                  .component('col-city', 'RsContainer')
                  .style({flexDirection: 'column', width: '36%', minWidth: '256px'})
                  .children(col => col.component('city', 'RsInput').prop('label', 'City').prop('placeholder', 'City'))

                  .component('col-zip', 'RsContainer')
                  .style({flexDirection: 'column', width: '28%', minWidth: '192px'})
                  .children(col => col.component('zip', 'RsInput').prop('label', 'Zip code').prop('placeholder', 'Zip code'))

                  .component('col-state', 'RsContainer')
                  .style({flexDirection: 'column', width: '36%', minWidth: '256px'})
                  .children(col => col.component('state', 'RsInput').prop('label', 'State').prop('placeholder', 'State'))
              )

              // Row 5: Country and Phone
              .component('row-country-phone', 'RsContainer')
              .style({flexDirection: 'row', gap: '16px'})
              .children(row =>
                row
                  .component('col-country', 'RsContainer')
                  .style({flexDirection: 'column', width: '36%', minWidth: '256px'})
                  .children(col =>
                    col
                      .component('country', 'RsDropdown')
                      .prop('label', 'Country')
                      .prop('placeholder', 'Country')
                      .prop('data', [
                        {value: 'United States', label: 'United States'},
                        {value: 'Canada', label: 'Canada'},
                        {value: 'United Kingdom', label: 'United Kingdom'},
                        {value: 'France', label: 'France'},
                        {value: 'Germany', label: 'Germany'},
                        {value: 'Japan', label: 'Japan'},
                      ])
                  )

                  .component('col-phone', 'RsContainer')
                  .style({flexDirection: 'column', width: '64%', minWidth: '192px'})
                  .children(col => col.component('phone', 'RsInput').prop('label', 'Phone').prop('placeholder', 'Phone'))
              )
          )
      )
  )

  .component('submit', 'RsButton')
  .prop('children', 'Book Now')
  .prop('color', 'blue')
  .prop('appearance', 'primary')
  .computedProp(
    'disabled',
    '  const data = form.rootData;\n' +
      "  const checkIn = data['check-in-date'];\n" +
      "  const checkOut = data['check-out-date'];\n" +
      "  const roomType = data['room-type'];\n" +
      "  const lastName = data['last-name'];\n" +
      "  const firstName = data['first-name'];\n" +
      '  return !checkIn || !checkOut || !roomType || !lastName || !firstName;\n'
  )
  .event('onClick')
  .commonAction('validate')
  .args({failOnError: true})
  .customAction('onSubmit')
  .json()
