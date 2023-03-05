import React, { useEffect, useState } from 'react';
import { RecoilRoot } from 'recoil';

import '../style/App.css';

interface ParticipantCard {
  id: number;
  participant: string;
  affiliation: string;
};

function App() {

  // 1. 参加者・カード情報-Data
  const [participantList, setParticipantList] = useState<ParticipantCard[]>([]);

  // 2. LocalStorageに登録者データを保存する処理
  const registerStorage = () => {
    localStorage.setItem('RandomLunchApp', JSON.stringify(participantList));
  };

  // 3. 参加者名の入力情報-Data
  const [participant, setParticipant] = useState<string>('');
  const inputParticipant = (event: React.ChangeEvent<HTMLInputElement>)=>{
    setParticipant(event.target.value);
  };

  // 4. 所属・部署の入力情報-Data
  const [affiliation, setAffiliation] = useState<string>('');
  const inputAffiliation = (event: React.ChangeEvent<HTMLInputElement>)=>{
    setAffiliation(event.target.value);
  };

  // 5. 参加者・カード情報を作成して、Dataを追加する
  const addParticipant = () => {
    if (participant === '') {
      alert('参加者名を入力してください');
      return;
    }
    if (affiliation === '') {
      alert('部署情報を入力してください');
      return;
    }
    let copyParticipantList = [...participantList];
    const idList: number[] = copyParticipantList.map((card: ParticipantCard) => card.id);
    const maxNum = Math.max(...idList);
    setParticipantList([...copyParticipantList, {id: maxNum +1, participant, affiliation }]);
  };

  // 6. 選択した参加者情報・カード(HTML)を削除する処理
  const deleteParticipantCard = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    // 型定義を拡張する => 型定義未対応によるError回避のため
    interface ExtendEventTarget extends EventTarget {
      value: string;
    };
    const elem = event.target as ExtendEventTarget;
    const id = Number(elem.value);
    const updateList: ParticipantCard[] = participantList.filter(card => card.id !== id);
    setParticipantList(updateList);
  };
  
  // 7. 参加者情報・カード(HTML)を作成して、画面に表示する
  const CreateParticipantCard = () => {
    return (
      <section>
        <h2 className="SectionTitle">参加者一覧(参加者カード)</h2>
        <div className="SectionArea">
          <p className="CardDiscription">登録されている人が、表示されます(クリックすると登録を削除することができます)</p>
          {
            participantList.map( (card, index) => {
              return (
                <button className='GroupCardBtn' key={index} value={card.id} onClick={(event) => deleteParticipantCard(event) } >{card.participant}さん ({card.affiliation})</button>
              );
            })
          }
        </div>
      </section>
    )
  };

  // 8. グループの人数 => 何人でグループ分けするか？
  const [groupingNum, setGroupingNum] = useState<string>('2');
  const inputGroupingNum = (event: React.ChangeEvent<HTMLInputElement>)=>{

    if (Number(event.target.value) <= 0) return;
    setGroupingNum(event.target.value);
  };

  // 9. 所属で分けるかを管理するFlag
  // const [isDiffAffili, setDiffAffili] = useState<boolean>(false);
  // const inputDiffAffili = (event: React.ChangeEvent<HTMLInputElement>)=>{
  //   setDiffAffili(event.target.checked);
  // };

  // 10. シャッフルされたDataが入る
  const [ randomList, setRandomList ] = useState<ParticipantCard[]>([]);

  // 11. 登録された情報からランダムにグループ分けする
  const randomGrouping = () => {
    const cloneArray = [...participantList];
    for (let i = cloneArray.length - 1; 0 <= i; i--) {
      // ランダムな値を取得する: 要素の値の長さ
      let randomNum = Math.floor(Math.random() * (i + 1));
      // 配列の要素の順番を入れ替える
      let tmpStorage = cloneArray[i];
      cloneArray[i] = cloneArray[randomNum];
      cloneArray[randomNum] = tmpStorage;
    }
    setRandomList(cloneArray);

    // シャッフルしたDataを元にグルーピングする
    groupingSeparate(cloneArray);
  };

  // 12. ランダムでグループ分けしたカード(HTML)を作成して、画面に表示する
  const GroupingParticipantCard = () => {
    return (
      <section>
        <h2 className="SectionTitle">ランダム・グループ分け</h2>
        <div className="SectionArea">
          <span className="Discription">グループの人数: </span>
          <input type="number" value={groupingNum} onChange={(event) => inputGroupingNum(event) }  />
          {/* 
          <label htmlFor="AffiliDiffCheck">
            <span className="Discription AffiliDiffDiscript">部署を別にする: </span>
            <input type="checkbox" id="AffiliDiffCheck" checked={isDiffAffili} onChange={(event) => inputDiffAffili(event) }  />
          </label> 
          */}
          <input type="button" value="シャッフル" onClick={() => randomGrouping() } className="Btn" />
        </div>
      </section>
    )
  };

  // 13. 部署ごとに区分けしたList
  // const [diffAffiliList, setDiffAffiliList] = useState<ParticipantCard[][]>([]);

  // // 部署が重複しないようにする区分けをしたListを作成する
  // const createDiffAffiliList = () => {
  //   const affiliationList = participantList.map(card => card.affiliation);
  //   console.log('affiliationList', affiliationList);

  //   // 重複を削除する
  //   const uniqueAffiliList = Array.from(new Set(affiliationList));
  //   console.log('uniqueAffiliList', uniqueAffiliList);

  //   const diffAffiliList = [] as ParticipantCard[][]; // 部署別・SeparateList
  //   let sameAffiliList = [] as ParticipantCard[];   // 同じ部署・List
  //   let len = participantList.length;
  //   uniqueAffiliList.forEach(affili => {
  //     participantList.forEach((card, index) => {
  //       if (affili === card.affiliation ) {
  //         sameAffiliList.push(card);
  //       }
  //       // 最後に、追加して、初期化する
  //       if (len === index + 1) {
  //         diffAffiliList.push(sameAffiliList);
  //         sameAffiliList = [];
  //       }
  //     });
  //   });
  //   setDiffAffiliList(diffAffiliList);
  // };


  // 14. シャッフルしたDataを指定の groupingNum でグルーピングする
  const [groupingList, setGroupingList] = useState<ParticipantCard[][]>([]);

  // 15. グループ分け設定(groupingNum)の数値に応じて、分割する
  const groupingSeparate = (randomList: ParticipantCard[]) => {
    let len = randomList.length;
    let curentNum = 0;    
    let tmpList = [] as ParticipantCard[];
    const separateList = [] as ParticipantCard[][];
    randomList.forEach((card, index) => {
      curentNum = index +1; // 0の数値が挙動を見出すため
      tmpList.push(card);

      // groupingNum ごとに separateListにPushする
      if (curentNum % Number(groupingNum) === 0) {
        separateList.push(tmpList);
        tmpList = []; //初期化処理
      }
      // あまりを処理する
      if (len === curentNum) {
        separateList.push(tmpList);
      }
    });
    setGroupingList(separateList);
  }


  // 16. LocalStorageに登録された情報を取得して、StateにSetする
  useEffect(() => {
    const jsonParticipantList = localStorage.getItem('RandomLunchApp');
    if (jsonParticipantList) {
      const parseParticipantList = JSON.parse(jsonParticipantList) as ParticipantCard[];
      setParticipantList(parseParticipantList);
    }
  }, []);

  // 17. グループ分けの結果を表示するBlock
  const GroupingResult = () => {
    return (
      <section>
        <h2 className="SectionTitle">グループ分けの結果</h2>
        <div className="SectionArea ResultArea">
          {/* グループ(多次元配列)を表示する */}
          {
            groupingList.map((group, index) => {
              return (
                <div className="Grouping" key={index}>
                   {
                    group.map((card, idx) => {
                      return (
                        <span className="RandomCard" key={card.id} >
                          {card.participant}さん ({card.affiliation})
                        </span>
                      )
                    })
                  }
                </div>
              )
            })
          }
        </div>
      </section>
    )
  };

  return (
    <div className="App">
      <RecoilRoot>
        <header className="AppHeader">
          <div className="HeaderWrapper">
            <h1 className="AppTitle">ランダムにメンバーを決めるApp(仮)</h1>
            <input type="button" value="参加者情報を保存する" onClick={() => registerStorage() } className="StorageBtn" />
          </div>
        </header>
        <main>
          <div className="MainWrapper">
            <section>
              <h2 className="SectionTitle">参加者登録</h2>
              <div className="SectionArea RegisterArea">
                <div>
                  <span className="Discription">参加者名: </span>
                  <input type="text" placeholder="AIQ 太郎" onChange={(event) => inputParticipant(event) } />
                </div>
                <div>
                  <span className="Discription">部署・所属: </span>
                  <input type="text" placeholder="エンジニア" onChange={(event) => inputAffiliation(event) } />
                </div>
                <input type="button" value="追加" onClick={() => addParticipant() } className="Btn" />
              </div>
            </section>
            <CreateParticipantCard  />
            <GroupingParticipantCard />
            <GroupingResult />
          </div>
        </main>
        <footer className="AppFooter">
          <div>
            <p>ランダムにメンバーを決めるApp(仮) Ver.0.5</p>
            <small>© 2023 ロボ玉先端技術研究所 All rights reserved.</small>
          </div>
        </footer>
      </RecoilRoot>
    </div>
  );
}

export default App;
