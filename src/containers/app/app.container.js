import React, { Component } from 'react';
import { Footer, Header } from '@aglet/components';

import { hunt, gather } from '../../../lib';
import style from './app.container.style.scss';

export default class AppContainer extends Component {
  state = {
    climate: 'temperate',
    terrain: 'forest',
    season: 'summer',
    time: 'dawn',
    hunters: {
      proficient: 1,
      nonProficient: 0,
    },
    gatherers: {
      proficient: 1,
      nonProficient: 0,
    },

    message: 'Hunt or Gather',
  };

  setting(group, name) {
    const buttonClasses = (name === this.state[group]) ? `${style.settingAction} ${style.active}` : `${style.settingAction}`;
    return (
      <button
        className={buttonClasses}
        onClick={() => this.setState({ [group]: name })}
      >
        {name}
      </button>
    );
  }

  hunt() {
    this.setState({ message: 'hunting...' });
    setTimeout(() => this.setState({
      message: hunt(this.state.climate, this.state.terrain, this.state.season, 1),
    }), 500);
  }

  gather() {
    this.setState({ message: 'gathering...' });
    setTimeout(() => this.setState({
      message: gather(this.state.climate, this.state.terrain, this.state.season),
    }), 500);
  }

  increment(hg, proficiency) {
    this.setState({
      [hg]: Object.assign({}, this.state[hg], {
        [proficiency]: this.state[hg][proficiency] + 1,
      }),
    });
  }

  decrement(hg, proficiency) {
    const newValue = this.state[hg][proficiency] - 1;

    this.setState({
      [hg]: Object.assign({}, this.state[hg], {
        [proficiency]: (newValue <= 0) ? 0 : newValue,
      }),
    });
  }

  buildHGCounts() {
    let pH;
    let npH;
    let pG;
    let npG;
    if (this.state.hunters.proficient > 0) pH = `${this.state.hunters.proficient}p`;
    if (this.state.hunters.nonProficient > 0) npH = `${this.state.hunters.nonProficient}np`;
    if (this.state.gatherers.proficient > 0) pG = `${this.state.gatherers.proficient}p`;
    if (this.state.gatherers.nonProficient > 0) npG = `${this.state.gatherers.nonProficient}np`;

    let pValue;
    if (pH || npH) {
      if (this.state.hunters.proficient + this.state.hunters.nonProficient > 1) {
        pValue = `${pH || ''} ${npH || ''} Hunters`;
      } else {
        pValue = `${pH || ''} ${npH || ''} Hunter`;
      }
    } else {
      pValue = '0 Hunters';
    }

    let gValue;
    if (pG || npG) {
      if (this.state.gatherers.proficient + this.state.gatherers.nonProficient > 1) {
        gValue = `${pG || ''} ${npG || ''} Gatherers`;
      } else {
        gValue = `${pG || ''} ${npG || ''} Gatherer`;
      }
    } else {
      gValue = '0 Gatherers';
    }

    return `${pValue} / ${gValue}`;
  }

  render() {
    return (
      <div className={style.container}>
        <Header />
        <div className={style.content}>

          <div className={style.currentSettings}>
            <div className={style.whereWhen}>
              {this.state.climate} / {this.state.terrain} / {this.state.season} / {this.state.time}
            </div>
            <div className={style.who}>{this.buildHGCounts()}</div>
          </div>

          <div className={style.actions}>
            <button
              className={`${style.button} ${style.hunt}`}
              onClick={() => this.hunt()}
              disabled={this.state.hunters.proficient + this.state.hunters.nonProficient < 1}
            >Hunt</button>
            <button
              className={style.button}
              onClick={() => this.gather()}
              disabled={this.state.gatherers.proficient + this.state.gatherers.nonProficient < 1}
            >Gather</button>
          </div>

          <div className={style.results}>{this.state.message}</div>

          <div className={style.settings}>
            <div className={style.group}>
              <div className={style.heading}>Time</div>
              <div className={style.setActions}>
                {this.setting('time', 'dawn')}
                {this.setting('time', 'day')}
                {this.setting('time', 'dusk')}
                {this.setting('time', 'night')}
              </div>
            </div>

            <div className={style.group}>
              <div className={style.heading}>Terrain</div>
              <div className={style.setActions}>
                {this.setting('terrain', 'mountains')}
                {this.setting('terrain', 'hills')}
                {this.setting('terrain', 'plains')}
                {this.setting('terrain', 'forest')}
                {this.setting('terrain', 'swamp')}
                {this.setting('terrain', 'desert')}
                {this.setting('terrain', 'coast')}
              </div>
            </div>

            <div className={style.group}>
              <div className={style.heading}>Season</div>
              <div className={style.setActions}>
                {this.setting('season', 'spring')}
                {this.setting('season', 'summer')}
                {this.setting('season', 'fall')}
                {this.setting('season', 'winter')}
              </div>
            </div>

            <div className={style.group}>
              <div className={style.heading}>climate</div>
              <div className={style.setActions}>
                {this.setting('climate', 'tropical')}
                {this.setting('climate', 'subtropical')}
                {this.setting('climate', 'temperate')}
                {this.setting('climate', 'subarctic')}
                {this.setting('climate', 'arctic')}
              </div>
            </div>

            <div className={style.group}>
              <div className={style.heading}>hunters</div>
              <div className={style.setActions}>
                <div className={style.incrementGroup}>
                  <div>{this.state.hunters.proficient} / proficient</div>
                  <div className={style.incrementGroupActions}>
                    <button
                      onClick={() => this.increment('hunters', 'proficient')}
                      className={style.incrementGroupAction}
                    >+</button>
                    <button
                      onClick={() => this.decrement('hunters', 'proficient')}
                      className={style.incrementGroupAction}
                      disabled={this.state.hunters.proficient < 1}
                    >-</button>
                  </div>
                </div>
                <div className={style.incrementGroup}>
                  <div>{this.state.hunters.nonProficient} / non-proficient</div>
                  <div className={style.incrementGroupActions}>
                    <button
                      onClick={() => this.increment('hunters', 'nonProficient')}
                      className={style.incrementGroupAction}
                    >+</button>
                    <button
                      onClick={() => this.decrement('hunters', 'nonProficient')}
                      className={style.incrementGroupAction}
                      disabled={this.state.hunters.nonProficient < 1}
                    >-</button>
                  </div>
                </div>
              </div>
            </div>

            <div className={style.group}>
              <div className={style.heading}>gatherers</div>
              <div className={style.setActions}>
                <div className={style.incrementGroup}>
                  <div>{this.state.gatherers.proficient} / proficient</div>
                  <div className={style.incrementGroupActions}>
                    <button
                      onClick={() => this.increment('gatherers', 'proficient')}
                      className={style.incrementGroupAction}
                    >+</button>
                    <button
                      onClick={() => this.decrement('gatherers', 'proficient')}
                      className={style.incrementGroupAction}
                      disabled={this.state.gatherers.proficient < 1}
                    >-</button>
                  </div>
                </div>
                <div className={style.incrementGroup}>
                  <div>{this.state.gatherers.nonProficient} / non-proficient</div>
                  <div className={style.incrementGroupActions}>
                    <button
                      onClick={() => this.increment('gatherers', 'nonProficient')}
                      className={style.incrementGroupAction}
                    >+</button>
                    <button
                      onClick={() => this.decrement('gatherers', 'nonProficient')}
                      className={style.incrementGroupAction}
                      disabled={this.state.gatherers.nonProficient < 1}
                    >-</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer repo={'https://github.com/luetkemj/aglet-hunter-gatherer/'} />
      </div>
    );
  }
}
