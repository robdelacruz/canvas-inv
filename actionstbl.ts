/*
Types
-----
ActionCB
ActionsTbl

ActionsTbl
----------
NewActionsTbl():ActionsTbl
ActionsTblAddAction(at, actionID:string, fn:ActionCB)
ActionsTblUpdate(at)

*/

interface ActionCB {(msElapsed:number): boolean;}
interface ActionsTbl {
    fns:        {[actionID:string]:ActionCB},
    lastTimes:  {[actionID:string]:number},
}

function NewActionsTbl():ActionsTbl {
    return <ActionsTbl>{
        fns: {},
        lastTimes: {},
    };
}

function ActionsTblAddAction(at:ActionsTbl, actionID:string, fn:ActionCB) {
    at.fns[actionID] = fn;
    const msNow = new Date().getTime();
    at.lastTimes[actionID] = msNow;
}

function ActionsTblUpdate(at:ActionsTbl) {
    const msNow = new Date().getTime();

    for (const actionID in at.fns) {
        let msLastTime = at.lastTimes[actionID];
        const msElapsed = msNow - msLastTime;
        const actionFn = at.fns[actionID];

        if (actionFn(msElapsed) == true) {
            at.lastTimes[actionID] = msNow;
        }
    }
}

export {
    ActionsTbl,
    ActionCB,
    NewActionsTbl,
    ActionsTblAddAction,
    ActionsTblUpdate,
};
