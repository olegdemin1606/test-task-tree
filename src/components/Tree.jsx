import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getTreeData } from '../Api/treeApi'
import * as treeActions from '../store/TreeReducer'

const Tree = (props) => {

    useEffect(()=>{
        getTreeData().then(data=>setTreeAction(data))
    },[])

    const {data,active,select}=props
    const {setTreeAction,setActiveAction,setSelectAction}=props.actions

    const handlerClick=(e,id,children)=>{
        e.stopPropagation()
        setActiveAction(!children?active:active!==id?id:null)
        setSelectAction(!children?id:null)
    }

    const checkChildActive=(elem)=>{
        let found=false

        const recursion=(elem)=>{
            if(!found){
                if(!elem.children)return false
                elem.children.map(child=>{
                    if(child.id===active)found=true
                    else if(child.children){
                        recursion(child)
                    }
                })
            }
        }
        recursion(elem)
        return found
    }

    const Element=({data})=>{
        const {id,name,children}=data

        return <div className='tree__branch' 
                    >
            <span 
                onClick={(e)=>handlerClick(e,id,children)}
                className={children?
                        (active===id || checkChildActive(data))?
                        'tree__name parent-style active':
                            'tree__name parent-style':
                            select===id?
                            'tree__name active':
                            'tree__name'}
                >
                   {children &&  
                        <span 
                        className={(active===id || checkChildActive(data))?
                        'tree__arrow active':'tree__arrow'}
                        >
                        </span>}
                    {name}
            </span>
            {children &&
                <span 
                    className={active===id || checkChildActive(data)?
                    'tree__children active':
                    'tree__children'}
                >
                    {children.map(elem=>
                        <Element data={elem} key={elem.id}/>)}
                </span>
            }
        </div>
    }

    const handlerTree=(obj)=>{
        return [...obj.map(elem=><Element data={elem} key={elem.id}/>)]
    }

    return (
        <div className='tree'>
            {handlerTree(data)}
        </div>
    )
}

export default connect(
    state=>({
        data:state.tree.tree,
        active:state.tree.active,
        select:state.tree.select
    }),
    dispatch=>({
        actions:bindActionCreators(treeActions,dispatch)
    })
)(Tree)