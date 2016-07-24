import {Component, OnInit} from "@angular/core";
import {DoseAmigosToolbar} from "../../dose-amigos-toolbar/dose-amigos-toolbar.component";
import {MedListComponenet} from "../../med-list-event/med-list-event.component";
import {DoseMedication} from "../../dose-medication/dose-medication";
import {DoseMedicationService} from "../../dose-medication-service/dose-medication.service";
import {MedListCreateComponent} from "../../med-list-create-component/med-list-create.component";
import {Events, NavController} from "ionic-angular/index";
import {LoadingStatusService} from "../../loading-status-service/loading-status.service";
import {LoadingStatus} from "../../loading-status/loading-status";

@Component(
    {
        templateUrl: "build/pages/med-list/med-list.html",
        directives: [
            DoseAmigosToolbar,
            MedListComponenet,
            MedListCreateComponent
        ]
    }
)
export class MedListPage implements OnInit {

    public title: string = "Medications";
    public doseMedications: Array<DoseMedication> = [];

    constructor(
        private doseMedicationService: DoseMedicationService,
        private events: Events,
        private nav: NavController,
        private loadingStatusService: LoadingStatusService
    ) {

        /* Refresh page data when a new doseSeries is created. */
        events.subscribe(
            "doseSeries:created",
            () => {
                this.loadMedicationList();
            }
        );

    }

    public loadMedicationList = (): any => {

        const loadingStatus: LoadingStatus = this.loadingStatusService.start(this.nav);

        const listPromise = this.doseMedicationService.list().then(
            (doseMedications) => {
                this.doseMedications = doseMedications;
            }
        );

        /* Wait on request to resolve, and loading mask to display, then stop loading status. */
        return Promise.all(
            [
                listPromise,
                loadingStatus.displayPromise
            ]
        ).then(
            () => {
                loadingStatus.loading.dismiss();
            }
        ).catch(
            () => {
                loadingStatus.loading.dismiss();
            }
        );
    };

    public ngOnInit(): any {
        return this.loadMedicationList();
    }

}