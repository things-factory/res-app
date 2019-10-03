import { html, css } from 'lit-element'
import { BoardViewerPage } from '@things-factory/board-ui'
import { UPDATE_DASHBOARD_SETTINGS } from '../../actions/dashboard-settings'
import { fetchDashboardSettings } from '../../viewparts/fetch-dashboard-settings'
import { openPopup } from '@things-factory/layout-base'
import { i18next } from '@things-factory/i18n-base'
import { client, gqlBuilder, store } from '@things-factory/shell'
import gql from 'graphql-tag'

const HOME_BOARD = 'home'
const HOME_DESCRIPTION = 'home dashboard'

class Dashboard extends BoardViewerPage {
  static get styles() {
    return [
      css`
        oops-note {
          display: block;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      `
    ].concat(BoardViewerPage.styles)
  }

  get context() {
    return {
      title: this._board && this._board.name
    }
  }

  stateChanged(state) {
    super.stateChanged(state)

    this._boardId = (state.dashboard[HOME_BOARD] || { board: {} }).board.id
  }

  render() {
    if (!this._boardId) {
      return html`
        <oops-note
          icon="insert_chart"
          title="HOME DASHBOARD"
          description="There are no home dashboard setting. Pls, click to setting home dashboard."
          @click=${e => this.onClickDashboardSetting(HOME_BOARD, HOME_DESCRIPTION)}
        ></oops-note>
      `
    }

    return super.render()
  }

  onClickDashboardSetting(name, description) {
    var popup = openPopup(
      html`
        <board-selector
          .creatable=${true}
          @board-selected=${async e => {
            var board = e.detail.board

            await this.saveSettings({
              name,
              value: board.id,
              category: 'board',
              description
            })

            var settings = await fetchDashboardSettings()
            store.dispatch({
              type: UPDATE_DASHBOARD_SETTINGS,
              settings: settings.reduce((settings, setting) => {
                settings[setting.name] = setting
                return settings
              }, {})
            })

            popup.close()
            this.requestUpdate()
          }}
        ></board-selector>
      `,
      {
        backdrop: true,
        size: 'large',
        title: i18next.t('title.dashboard setting')
      }
    )
  }

  async saveSettings({ name, value, category, description }) {
    if (!(name && value)) return

    await client.query({
      query: gql`
      mutation {
        updateSetting(${gqlBuilder.buildArgs({
          name,
          patch: {
            name,
            description,
            category,
            value
          }
        })}) {
          name
          value
        }
      }`
    })
  }
}

customElements.define('res-dashboard', Dashboard)
