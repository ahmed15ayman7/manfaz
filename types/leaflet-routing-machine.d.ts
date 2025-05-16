// types/leaflet-routing-machine.d.ts
import * as L from "leaflet";

declare module "leaflet" {
    namespace Routing {
        function control(options: any): any;
        interface Control {
            getWaypoints(): L.LatLng[];
            setWaypoints(waypoints: L.LatLng[]): void;
            remove(): void;
            on(event: string, callback: (e: any) => void): void;
        }
    }
    interface Map {
        routingControl: Routing.Control;
    }
}
