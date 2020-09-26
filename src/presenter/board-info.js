import {render, RenderPosition, remove} from "../utils/render.js";
import RouteInfoView from "../view/route-info.js";
import {groupByDay, getRouteInfo} from "../utils/task.js";

export default class BoardInfo {
  constructor(headerContainer, pointsModel) {
    this._headerContainer = headerContainer;
    this._pointsModel = pointsModel;
    this._routeInfoComponent = null;

    this._points = this._pointsModel.getPoints();
    this._points = groupByDay(this._pointsModel.getPoints());
    this._routeInfo = getRouteInfo(this._points);

    this._handleModelChange = this._handleModelChange.bind(this);
    this._pointsModel.addObserver(this._handleModelChange);
  }

  init() {
    this._renderBoardInfo();
  }

  _handleModelChange() {
    remove(this._routeInfoComponent);
    const groupEvents = groupByDay(this._pointsModel.getPoints());
    this._routeInfo = getRouteInfo(groupEvents);
    this._renderBoardInfo();
  }

  _renderBoardInfo() {
    this._routeInfoComponent = new RouteInfoView(this._routeInfo);
    render(this._headerContainer, this._routeInfoComponent, RenderPosition.AFTERBEGIN);
  }
}
