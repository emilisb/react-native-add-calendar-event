/**
 * Sample React Native App with adding events to calendar
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import * as AddCalendarEvent from 'rn-add-calevent';
import moment from 'moment';

const utcDateToString = (momentInUTC: moment): string => {
  let s = moment.utc(momentInUTC).valueOf();
  // console.warn(s);
  return s;
};

export default class EventDemo extends Component {
  state = { text: '' };
  render() {
    const eventTitle = 'Lunch';
    const nowUTC = moment.utc();
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Event title: {eventTitle}</Text>
        <Text>
          date:{' '}
          {moment
            .utc(nowUTC)
            .local()
            .format('lll')}
        </Text>

        <Button
          onPress={() => {
            EventDemo.addToCalendar(eventTitle, nowUTC);
          }}
          title="Add to calendar"
        />
        <TextInput
          style={{ height: 40, width: '100%', marginTop: 30, marginHorizontal: 15 }}
          placeholder="enter event id"
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
        />
        <Button
          onPress={() => {
            EventDemo.editCalendarEventWithId(this.state.text);
          }}
          title="Edit event with this id"
        />
      </View>
    );
  }

  static addToCalendar = (title: string, startDateUTC: moment) => {
    const eventConfig = {
      title,
      startDate: utcDateToString(startDateUTC),
      endDate: utcDateToString(moment.utc(startDateUTC).add(1, 'hours')),
    };

    AddCalendarEvent.presentEventDialog(eventConfig)
      .then((eventInfo: { calendarItemIdentifier: string, eventIdentifier: string }) => {
        // handle success - receives an object with `calendarItemIdentifier` and `eventIdentifier` keys, both of type string.
        // These are two different identifiers on iOS.
        // On Android, where they are both equal and represent the event id, also strings.
        // when false is returned, the dialog was dismissed
        if (eventInfo) {
          console.warn(JSON.stringify(eventInfo));
        } else {
          console.warn('dismissed');
        }
      })
      .catch((error: string) => {
        // handle error such as when user rejected permissions
        console.warn(error);
      });
  };

  static editCalendarEventWithId = (eventId: string) => {
    const eventConfig = {
      eventId,
    };

    AddCalendarEvent.presentEventDialog(eventConfig)
      .then(eventId => {
        // eventId is always returned when editing events
        console.warn(eventId);
      })
      .catch((error: string) => {
        // handle error such as when user rejected permissions
        console.warn(error);
      });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
