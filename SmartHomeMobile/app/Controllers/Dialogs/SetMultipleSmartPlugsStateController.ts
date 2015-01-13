﻿module JustinCredible.SmartHomeMobile.Controllers {

    export interface ISetMultipleSmartPlugsState {
        viewModel: ViewModels.SetMultipleSmartPlugsStateViewModel;
    }

    export class SetMultipleSmartPlugsStateController extends BaseDialogController<ViewModels.SetMultipleSmartPlugsStateViewModel, AlertMeApiTypes.SmartPlugDevice[], AlertMeApiTypes.SmartPlugDevice[]> implements ISetMultipleSmartPlugsState {

        public static $inject = ["$scope", "Utilities", "Preferences", "UiHelper"];

        private Utilities: Services.Utilities;
        private Preferences: Services.Preferences;

        constructor($scope: ng.IScope, Utilities: Services.Utilities, Preferences: Services.Preferences, UiHelper: Services.UiHelper) {
            super($scope, ViewModels.SetMultipleSmartPlugsStateViewModel, UiHelper.DialogIds.SetMultipleSmartPlugsState);

            this.Utilities = Utilities;
            this.Preferences = Preferences;
        }

        //#Region BaseDialogController Overrides

        public dialog_shown(): void {
            this.viewModel.stateChanged = false;
            this.viewModel.smartPlugs = this.getData();
        }

        //#endregion

        //#region Attribute/Expression Properties

        get lighting_show(): boolean {
            var outlets: AlertMeApiTypes.SmartPlugDevice[];

            // If there is no view model data, then the section shouldn't be visible.
            if (this.viewModel == null || this.viewModel.smartPlugs == null) {
                return false;
            }

            // We want to show the outlets section if we have applicances of type lighting.
            outlets = _.filter(this.viewModel.smartPlugs, (smartPlug: AlertMeApiTypes.SmartPlugDevice) => {
                return smartPlug.applianceType === "LIGHTS";
            });

            // We need at least one to show this section.
            return outlets.length > 0;
        }

        get outlets_show(): boolean {
            var outlets: AlertMeApiTypes.SmartPlugDevice[];

            // If there is no view model data, then the section shouldn't be visible.
            if (this.viewModel == null || this.viewModel.smartPlugs == null) {
                return false;
            }

            // We want to show the outlets section if we have applicances of type smart plug.
            outlets = _.filter(this.viewModel.smartPlugs, (smartPlug: AlertMeApiTypes.SmartPlugDevice) => {
                return smartPlug.applianceType === "SMARTPLUG";
            });

            // We need at least one to show this section.
            return outlets.length > 0;
        }

        //#endregion

        //#region Controller Methods

        public cancel_click(): void {
            this.close();
        }

        public done_click(): void {
            this.close(this.viewModel.smartPlugs);
        }

        public smartPlugToggle_click(smartPlug: AlertMeApiTypes.SmartPlugDevice[]): void {
            this.viewModel.stateChanged = true;
        }

        //#endregion
    }
}