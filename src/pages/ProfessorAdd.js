import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { postItem } from "../slice/ProfessorSlice";

import Spinner from "../components/Spinner";
import ErrorView from "../components/ErrorView";
import TableEx from "../components/TableEx";

import dayjs from "dayjs";

const ProfessorAdd = memo(() => {
  /** 저장 완료 후 목록으로 되돌아가기 위한 강제 이동 함수 설정 */
  const navigate = useNavigate();

  /** 리덕스 관련 초기화 */
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.ProfessorSlice);

  /** <form>의 submit 버튼이 눌러졌을 때 호출될 이벤트 핸들러 */
  const onProfessorSubmit = useCallback((e) => {
    e.preventDefault();

    // 이벤트가 발생한 폼 객체
    const current = e.currentTarget;

    // 리덕스를 통한 데이터 저장 요청
    dispatch(postItem({
        name: current.name.value,
        userid: current.userid.value,
        position: current.position.value,
        sal: parseInt(current.sal.value),
        hiredate: dayjs(current.hiredate.value).toISOString(),
        comm: parseInt(current.comm.value),
        deptno: parseInt(current.deptno.value),
      })).then((result) => {
      console.log(result);
      // 처리가 완료된 후 상세 페이지로 이동
      navigate(`/professor_view/${result.payload.id}`);
    });
  }, []);

  return (
    <div>
      {/* 로딩바 */}
      <Spinner loading={loading} />

      {error ? (
        <ErrorView error={error} />
      ) : (
        <form onSubmit={onProfessorSubmit}>
          <TableEx>
            <colgroup>
              <col width="120" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <th>이름</th>
                <td className="inputWrapper">
                  <input className="field" type="text" name="name" />
                </td>
              </tr>
              <tr>
                <th>아이디</th>
                <td className="inputWrapper">
                  <input className="field" type="text" name="userid" />
                </td>
              </tr>
              <tr>
                <th>직급</th>
                <td className="inputWrapper">
                  <input className="field" type="text" name="position" />
                </td>
              </tr>
              <tr>
                <th>급여</th>
                <td className="inputWrapper">
                  <input className="field" type="text" name="sal" placeholder="숫자만 입력하세요."/>
                </td>
              </tr>
              <tr>
                <th>입사일</th>
                <td className="inputWrapper">
                  <input className="field" type="date" name="hiredate" />
                </td>
              </tr>
              <tr>
                <th>보직수당</th>
                <td className="inputWrapper">
                  <input className="field" type="text" name="comm" placeholder="숫자만 입력하세요." />
                </td>
              </tr>
              <tr>
                <th>학과번호</th>
                <td className="inputWrapper">
                  <input className="field" type="text" name="deptno" />
                </td>
              </tr>
            </tbody>
          </TableEx>

          <div style={{ textAlign: "center" }}>
            <button type="submit">저장하기</button>
          </div>
        </form>
      )}
    </div>
  );
});

export default ProfessorAdd;
