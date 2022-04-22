import  { RestController, GET, POST, Autowired, PathValue, QueryValue, Body, Header } from '../../core/decorators'
import EventService from '../services/event_service';


@RestController('/event')
export default class EventController {
  @Autowired
  eventService: EventService;

  @GET('/get')
  hello1() {
    return this.eventService.test()
  }
}