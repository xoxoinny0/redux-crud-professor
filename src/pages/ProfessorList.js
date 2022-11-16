import React, { memo, useCallback, useEffect} from 'react';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';

import Spinner from '../components/Spinner';
import ErrorView from '../components/ErrorView';
import Table from '../components/Table';

import { useSelector, useDispatch } from 'react-redux';
import { getList, deleteItem } from '../slice/ProfessorSlice';

import styled from 'styled-components';

import dayjs from 'dayjs';

// 교수정보 추가하기 박스
const AddContainer = styled.form`
    position: sticky;
    top: 0;
    background-color: #fff;
    border-top: 1px solid #eee;
    padding: 10px 0;
    
    .controll {
        margin-right: 5px;
        display: inline-block;
        font-size: 16px;
        padding: 7px 10px 5px 10px;
        border: 1px solid #ccc
    }

    .clickable {
        background-color: #fff;
        color: #000;
        text-decoration: none;
        cursor: pointer;

        &:hover {
            background-color: #06f2;
        }

        &:active {
            transform: scale(0.9, 0.9);
        }
    }

`

const ProfessorList = memo(() => {
    /** 리덕스 관련 초기화 */
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.ProfessorSlice);

    /** 최초 마운트 시 리덕스를 통해 목록을 조회한다. */
    useEffect(() => {
        dispatch(getList());
    },[]);

    // 페이지 강제 이동을 처리하기 위한 navigate 함수 생성
    const navigate = useNavigate();

    /** 삭제 버튼에 대한 이벤트 리스너 */
    const onProfessorItemDelete = useCallback((e) => {
        e.preventDefault();

        const current = e.target;
        const { id, name, userid, position, sal, hiredate, comm, deptno} = current.dataset;

        if (window.confirm(`정말 ${name}을 삭제하겠습니까?`)) {
            dispatch(deleteItem({
                id: id
            }))
        }
    },[]);

    /** 수정 버튼에 대한 이벤트 리스너 */
    const onProfessorEditClick = useCallback((e) => {
        e.preventDefault();

        const current = e.target;
        const { id } = current.dataset;

        navigate(`/professor_edit/${id}`);
    })


  return (
    <div>
        {/* 로딩바 */}
        <Spinner loading={loading} />

        {/* 데이터 추가폼 */}
        <AddContainer>
            <NavLink to='professor_add' className='controll clickable'>교수정보 추가하기</NavLink>
        </AddContainer>

        {/* 조회 결과 표시하기 */}
        {error? (
            <ErrorView error={error} />
        ) : (
            // Ajax 처리 결과가 존재할 경우
            data && (
                <Table>
                    <thead>
                        <tr>
                            <td>No.</td>
                            <td>이름</td>
                            <td>아이디</td>
                            <td>직급</td>
                            <td>급여</td>
                            <td>입사일</td>
                            <td>보직수당</td>
                            <td>학과번호</td>
                            <td>수정</td>
                            <td>삭제</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            // 데이터 수가 0건인 경우를 구분
                            data.length > 0 ? (
                                data.map(({id, name, userid, position, sal, hiredate, comm, deptno}, i) => {
                                    return (
                                        <tr key={id}>
                                            <td>{id}</td>
                                            <td><NavLink to={`/professor_view/${id}`}>{name}</NavLink></td>
                                            <td>{userid}</td>
                                            <td>{position}</td>
                                            <td>{sal && `${sal}만원`}</td>
                                            <td>{hiredate ? (dayjs(hiredate).format('YY-MM-DD')) : ('')}</td>
                                            <td>{comm && `${comm}만원`}</td>
                                            <td>{deptno}</td>
                                            <td>
                                                <button type='button' data-id={id} onClick={onProfessorEditClick}>
                                                    수정하기
                                                </button>
                                            </td>
                                            <td>
                                                <button type='button' onClick={onProfessorItemDelete} data-id={id} data-name={name} data-userid={userid} data-position={position} data-sal={sal} data-hiredate={hiredate} data-comm={comm} data-deptno={deptno}>
                                                    삭제하기
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan='10' align='center'>
                                        검색결과가 없습니다.
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
            )
        )}
    </div>
  );
});

export default ProfessorList;